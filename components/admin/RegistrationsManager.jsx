import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { db } from '../../lib/firebase';
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { Trash2, CheckCircle, XCircle, ClipboardList, Mail, DollarSign } from 'lucide-react';
import { sendRegistrationEmail } from '../../lib/emailjs';
import toast from 'react-hot-toast';

export default function RegistrationsManager() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sendingEmail, setSendingEmail] = useState(false);

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'registrations'));
      setRegistrations(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error('Error fetching registrations:', error);
      toast.error('Failed to load registrations');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (reg) => {
    setSendingEmail(true);
    try {
      // Update status in Firebase
      await updateDoc(doc(db, 'registrations', reg.id), { status: 'approved' });
      
      console.log('Sending approval email to:', reg.gmail);
      
      // Send email
      await sendRegistrationEmail({
        gmail: reg.gmail,
        captainName: reg.captainName,
        teamName: reg.teamName,
        status: 'approved',
        registrationFee: reg.registrationFee || 0,
      });
      
      console.log('Email sent successfully!');
      toast.success(`${reg.teamName} approved! Email sent to ${reg.gmail}`);
      fetchRegistrations();
    } catch (error) {
      console.error('Approve error:', error);
      toast.error('Failed to approve: ' + (error.text || error.message));
    } finally {
      setSendingEmail(false);
    }
  };

  const handleReject = async (reg) => {
    setSendingEmail(true);
    try {
      await updateDoc(doc(db, 'registrations', reg.id), { status: 'rejected' });
      
      await sendRegistrationEmail({
        gmail: reg.gmail,
        captainName: reg.captainName,
        teamName: reg.teamName,
        status: 'rejected',
        registrationFee: reg.registrationFee || 0,
      });
      
      toast.success('Registration rejected. Email sent.');
      fetchRegistrations();
    } catch (error) {
      console.error('Reject error:', error);
      toast.error('Failed to reject: ' + (error.text || error.message));
    } finally {
      setSendingEmail(false);
    }
  };

  const handlePaymentVerified = async (id) => {
    try {
      await updateDoc(doc(db, 'registrations', id), { status: 'payment_verified' });
      toast.success('Payment verified!');
      fetchRegistrations();
    } catch (error) {
      toast.error('Failed to verify payment');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this registration?')) {
      try {
        await deleteDoc(doc(db, 'registrations', id));
        toast.success('Registration deleted!');
        fetchRegistrations();
      } catch (error) {
        toast.error('Failed to delete');
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-900/30 text-yellow-400';
      case 'pending_payment': return 'bg-orange-900/30 text-orange-400';
      case 'payment_verified': return 'bg-blue-900/30 text-blue-400';
      case 'approved': return 'bg-green-900/30 text-green-400';
      case 'rejected': return 'bg-red-900/30 text-red-400';
      default: return 'bg-gray-900/30 text-gray-400';
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold gold-text">Team Registrations</h2>
        <span className="text-gray-400">{registrations.length} Total</span>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 border-4 border-yellow-500/30 border-t-yellow-500 rounded-full animate-spin mx-auto" />
        </div>
      ) : registrations.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <ClipboardList className="w-16 h-16 mx-auto mb-4 text-gray-600" />
          <p>No registrations yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {registrations.map((reg) => (
            <motion.div
              key={reg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-900 p-6 rounded-xl border border-yellow-500/30"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold gold-text">{reg.teamName}</h3>
                  <p className="text-gray-400">Captain: {reg.captainName}</p>
                  <p className="text-gray-400 text-sm flex items-center space-x-1">
                    <Mail className="w-3 h-3" />
                    <span>{reg.gmail}</span>
                  </p>
                  {reg.registrationFee > 0 && (
                    <p className="text-gray-400 text-sm flex items-center space-x-1">
                      <DollarSign className="w-3 h-3" />
                      <span>₱{reg.registrationFee}</span>
                    </p>
                  )}
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(reg.status)}`}>
                  {reg.status.toUpperCase().replace('_', ' ')}
                </span>
              </div>

              <div className="mb-4">
                <p className="text-sm silver-text mb-2">Players:</p>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                  {reg.players?.map((player, index) => (
                    <div key={index} className="bg-black p-2 rounded text-sm text-gray-300">
                      {player || `Player ${index + 1}`}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap space-x-2">
                {reg.status === 'pending_payment' && (
                  <button 
                    onClick={() => handlePaymentVerified(reg.id)} 
                    disabled={sendingEmail}
                    className="flex items-center space-x-1 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg"
                  >
                    <DollarSign className="w-4 h-4" />
                    <span>Verify Payment</span>
                  </button>
                )}
                
                {(reg.status === 'pending' || reg.status === 'payment_verified') && (
                  <>
                    <button 
                      onClick={() => handleApprove(reg)} 
                      disabled={sendingEmail}
                      className="flex items-center space-x-1 px-4 py-2 bg-green-500/20 text-green-400 rounded-lg"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>{sendingEmail ? 'Sending...' : 'Approve'}</span>
                    </button>
                    <button 
                      onClick={() => handleReject(reg)} 
                      disabled={sendingEmail}
                      className="flex items-center space-x-1 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Reject</span>
                    </button>
                  </>
                )}
                
                <button 
                  onClick={() => handleDelete(reg.id)} 
                  className="flex items-center space-x-1 px-4 py-2 bg-gray-700 text-gray-300 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}