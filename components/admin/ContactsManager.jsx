import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { db } from '../../lib/firebase';
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { Trash2, Mail, MessageSquare, CheckCircle, Reply } from 'lucide-react';
import { sendRegistrationEmail } from '../../lib/emailjs';
import toast from 'react-hot-toast';

export default function ContactsManager() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [sendingReply, setSendingReply] = useState(false);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'contacts'));
      const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      msgs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setContacts(msgs);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await updateDoc(doc(db, 'contacts', id), { status: 'read' });
      toast.success('Marked as read');
      fetchContacts();
    } catch (error) {
      toast.error('Failed to update');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this message?')) {
      try {
        await deleteDoc(doc(db, 'contacts', id));
        toast.success('Message deleted!');
        fetchContacts();
      } catch (error) {
        toast.error('Failed to delete');
      }
    }
  };

  const handleReply = async () => {
    if (!replyText.trim()) {
      toast.error('Please type a reply');
      return;
    }

    setSendingReply(true);
    
    try {
      await sendRegistrationEmail({
        gmail: replyingTo.email,
        captainName: replyingTo.name,
        teamName: replyingTo.subject,
        status: 'REPLY',
        registrationFee: 0,
        message: replyText,
      });

      await updateDoc(doc(db, 'contacts', replyingTo.id), { 
        status: 'replied',
        reply: replyText,
        repliedAt: new Date().toISOString(),
      });

      toast.success('Reply sent successfully!');
      setReplyingTo(null);
      setReplyText('');
      fetchContacts();
    } catch (error) {
      console.error('Reply error:', error);
      toast.error('Failed to send reply');
    } finally {
      setSendingReply(false);
    }
  };

  const unreadCount = contacts.filter(c => c.status === 'unread').length;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold gold-text">Messages</h2>
        <span className="text-gray-400">{unreadCount} Unread</span>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 border-4 border-yellow-500/30 border-t-yellow-500 rounded-full animate-spin mx-auto" />
        </div>
      ) : contacts.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-600" />
          <p>No messages yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {contacts.map((contact) => (
            <motion.div
              key={contact.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-gray-900 p-6 rounded-xl border ${
                contact.status === 'unread' 
                  ? 'border-yellow-500/50' 
                  : contact.status === 'replied'
                  ? 'border-green-500/30'
                  : 'border-gray-700'
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg font-bold gold-text">{contact.subject}</h3>
                  <p className="text-gray-400 text-sm flex items-center space-x-1">
                    <Mail className="w-3 h-3" />
                    <span>{contact.email}</span>
                  </p>
                  <p className="text-gray-500 text-xs">{contact.name}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  contact.status === 'unread' ? 'bg-yellow-900/30 text-yellow-400' :
                  contact.status === 'replied' ? 'bg-green-900/30 text-green-400' :
                  'bg-gray-700 text-gray-300'
                }`}>
                  {contact.status.toUpperCase()}
                </span>
              </div>

              <p className="text-gray-300 mb-4">{contact.message}</p>

              {contact.reply && (
                <div className="bg-black p-3 rounded-lg mb-4 border border-green-500/30">
                  <p className="text-xs text-green-400 mb-1">Your reply:</p>
                  <p className="text-gray-300 text-sm">{contact.reply}</p>
                </div>
              )}

              {replyingTo?.id === contact.id ? (
                <div className="bg-black p-4 rounded-lg mb-4">
                  <p className="text-sm silver-text mb-2">Reply to {contact.name}:</p>
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    rows="3"
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white mb-2"
                    placeholder="Type your reply..."
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={handleReply}
                      disabled={sendingReply}
                      className="px-4 py-2 bg-yellow-500 text-black font-semibold rounded-lg"
                    >
                      {sendingReply ? 'Sending...' : 'Send Reply'}
                    </button>
                    <button
                      onClick={() => {
                        setReplyingTo(null);
                        setReplyText('');
                      }}
                      className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    {contact.createdAt ? new Date(contact.createdAt).toLocaleString() : 'Just now'}
                  </span>
                  <div className="flex space-x-2">
                    {contact.status === 'unread' && (
                      <button
                        onClick={() => handleMarkRead(contact.id)}
                        className="flex items-center space-x-1 px-3 py-2 bg-green-500/20 text-green-400 rounded-lg"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Mark Read</span>
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setReplyingTo(contact);
                        setReplyText('');
                      }}
                      className="flex items-center space-x-1 px-3 py-2 bg-blue-500/20 text-blue-400 rounded-lg"
                    >
                      <Reply className="w-4 h-4" />
                      <span>Reply</span>
                    </button>
                    <button
                      onClick={() => handleDelete(contact.id)}
                      className="flex items-center space-x-1 px-3 py-2 bg-red-500/20 text-red-400 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}