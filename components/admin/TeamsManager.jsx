import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { db } from '../../lib/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, writeBatch } from 'firebase/firestore';
import { Plus, Edit, Trash2, Upload, X, GripVertical } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import toast from 'react-hot-toast';

function SortableTeamCard({ team, onEdit, onDelete }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: team.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: isDragging ? 'grabbing' : 'grab',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative bg-gray-900 rounded-xl border-2 overflow-hidden ${
        isDragging ? 'border-yellow-500' : 'border-yellow-500/30'
      }`}
    >
      {/* Drag Handle */}
      <button
        {...attributes}
        {...listeners}
        className="absolute top-2 right-2 z-20 bg-black/50 p-1.5 rounded cursor-grab active:cursor-grabbing"
      >
        <GripVertical className="w-4 h-4 text-yellow-500" />
      </button>

      <div className="w-full aspect-square">
        {team.banner ? (
          <img src={team.banner} alt={team.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-yellow-500/20 to-gray-700 flex items-center justify-center">
            <Users className="w-8 h-8 text-gray-500" />
          </div>
        )}
      </div>

      <div className="p-3">
        <h3 className="text-sm font-bold gold-text truncate">{team.name}</h3>
        <p className="text-gray-400 text-xs truncate">{team.division}</p>
        <div className="flex justify-between text-[10px] text-gray-400 mt-1">
          <span>{team.players || 0}P</span>
          <span>{team.wins || 0}W - {team.losses || 0}L</span>
        </div>
        <div className="flex space-x-1 mt-2">
          <button
            onClick={() => onEdit(team)}
            className="flex-1 flex items-center justify-center space-x-1 px-2 py-1.5 bg-blue-500/20 text-blue-400 rounded text-xs"
          >
            <Edit className="w-3 h-3" />
          </button>
          <button
            onClick={() => onDelete(team.id)}
            className="flex-1 flex items-center justify-center space-x-1 px-2 py-1.5 bg-red-500/20 text-red-400 rounded text-xs"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function TeamsManager() {
  const [teams, setTeams] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const [form, setForm] = useState({
    name: '',
    division: '',
    banner: '',
    players: 0,
    wins: 0,
    losses: 0,
    order: 0,
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'teams'));
      const teamsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      teamsData.sort((a, b) => (a.order || 0) - (b.order || 0));
      setTeams(teamsData);
    } catch (error) {
      toast.error('Failed to load teams');
    }
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      setTeams((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        const newItems = arrayMove(items, oldIndex, newIndex);
        
        // Update order in Firebase
        const batch = writeBatch(db);
        newItems.forEach((item, index) => {
          const teamRef = doc(db, 'teams', item.id);
          batch.update(teamRef, { order: index });
        });
        batch.commit().then(() => {
          toast.success('Team order updated!');
        });
        
        return newItems;
      });
    }
  };

  const handleBannerUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'RVC_MEDIA');
      const response = await fetch(
        'https://api.cloudinary.com/v1_1/qmsxe5lq/image/upload',
        { method: 'POST', body: formData }
      );
      const data = await response.json();
      if (data.secure_url) {
        setForm(prev => ({ ...prev, banner: data.secure_url }));
        toast.success('Banner uploaded!');
      }
    } catch (error) {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.division) {
      toast.error('Please fill in required fields');
      return;
    }
    try {
      if (editingTeam) {
        await updateDoc(doc(db, 'teams', editingTeam.id), form);
        toast.success('Team updated!');
      } else {
        await addDoc(collection(db, 'teams'), { ...form, order: teams.length });
        toast.success('Team added!');
      }
      setIsModalOpen(false);
      setEditingTeam(null);
      setForm({ name: '', division: '', banner: '', players: 0, wins: 0, losses: 0, order: 0 });
      fetchTeams();
    } catch (error) {
      toast.error('Failed to save team');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this team?')) {
      await deleteDoc(doc(db, 'teams', id));
      toast.success('Team deleted!');
      fetchTeams();
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold gold-text">Teams</h2>
          <p className="text-xs text-gray-400">Drag the grip icon to reorder teams</p>
        </div>
        <button
          onClick={() => {
            setEditingTeam(null);
            setForm({ name: '', division: '', banner: '', players: 0, wins: 0, losses: 0, order: 0 });
            setIsModalOpen(true);
          }}
          className="flex items-center space-x-2 px-4 py-2 bg-yellow-500 text-black font-semibold rounded-lg"
        >
          <Plus className="w-4 h-4" />
          <span>Add Team</span>
        </button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={teams.map(t => t.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {teams.map((team) => (
              <SortableTeamCard
                key={team.id}
                team={team}
                onEdit={(t) => {
                  setEditingTeam(t);
                  setForm(t);
                  setIsModalOpen(true);
                }}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* Modal - Same as before */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 p-6 rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold gold-text">
                {editingTeam ? 'Edit Team' : 'Add Team'}
              </h3>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm silver-text mb-2">Team Banner</label>
                {form.banner ? (
                  <div className="relative">
                    <img src={form.banner} alt="Banner" className="w-full h-32 object-cover rounded-lg" />
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, banner: '' })}
                      className="absolute top-2 right-2 bg-red-500 p-1 rounded-full"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-700 rounded-lg cursor-pointer"
                  >
                    <Upload className="w-6 h-6 text-gray-400" />
                    <span className="text-gray-400 text-sm">Upload Banner</span>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleBannerUpload(e.target.files[0])}
                />
              </div>

              <input
                type="text"
                placeholder="Team Name *"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg text-white"
                required
              />
              <input
                type="text"
                placeholder="Division *"
                value={form.division}
                onChange={(e) => setForm({ ...form, division: e.target.value })}
                className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg text-white"
                required
              />
              <div className="grid grid-cols-3 gap-2">
                <input type="number" placeholder="Players" value={form.players} onChange={(e) => setForm({ ...form, players: parseInt(e.target.value) || 0 })} className="px-3 py-2 bg-black border border-gray-700 rounded-lg text-white text-sm" />
                <input type="number" placeholder="Wins" value={form.wins} onChange={(e) => setForm({ ...form, wins: parseInt(e.target.value) || 0 })} className="px-3 py-2 bg-black border border-gray-700 rounded-lg text-white text-sm" />
                <input type="number" placeholder="Losses" value={form.losses} onChange={(e) => setForm({ ...form, losses: parseInt(e.target.value) || 0 })} className="px-3 py-2 bg-black border border-gray-700 rounded-lg text-white text-sm" />
              </div>
              <div className="flex space-x-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2 bg-gray-700 text-gray-300 rounded-lg">Cancel</button>
                <button type="submit" className="flex-1 py-2 bg-yellow-500 text-black font-semibold rounded-lg">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}