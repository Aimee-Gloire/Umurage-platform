import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Award, Download, Share2, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useAuthStore } from '../../store/auth';

type Certificate = {
  id: string;
  courseId: number;
  userId: string;
  issuedAt: string;
  courseName: string;
  grade: string;
  completionDate: string;
};

const mockCertificate: Certificate = {
  id: "CERT-RWD-123456",
  courseId: 1,
  userId: "user123",
  issuedAt: "2024-03-15T14:30:00Z",
  courseName: "Kinyarwanda Language Essentials",
  grade: "A",
  completionDate: "March 15, 2024",
};

function CertificatePage() {
  const { user } = useAuthStore();
  const [isDownloading, setIsDownloading] = useState(false);
  const [certificate, setCertificate] = useState(mockCertificate);
  const [showShareModal, setShowShareModal] = useState(false);
  
  // Reference to certificate element for download
  const certificateRef = React.useRef<HTMLDivElement>(null);
  
  // Function to download certificate as PDF
  const downloadCertificate = async () => {
    if (!certificateRef.current) return;
    
    try {
      setIsDownloading(true);
      toast.loading('Preparing your certificate...');
      
      const certificateElement = certificateRef.current;
      const canvas = await html2canvas(certificateElement, {
        scale: 2,
        logging: false,
        useCORS: true,
        backgroundColor: '#ffffff',
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      });
      
      const imgWidth = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`Umurage_Certificate_${certificate.courseName.replace(/\s+/g, '_')}.pdf`);
      
      toast.dismiss();
      toast.success('Certificate downloaded successfully!');
    } catch (error) {
      console.error('Error downloading certificate:', error);
      toast.dismiss();
      toast.error('Failed to download certificate. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };
  
  // Function to handle certificate sharing
  const shareCertificate = async (method: 'email' | 'twitter' | 'linkedin' | 'facebook' | 'copy') => {
    setShowShareModal(false);
    
    const certificateUrl = `https://umurage.rw/verify-certificate/${certificate.id}`;
    const shareMessage = `I've completed the "${certificate.courseName}" course on Umurage Learning Platform. View my certificate:`;
    
    switch (method) {
      case 'email':
        window.open(`mailto:?subject=My Umurage Learning Certificate&body=${encodeURIComponent(shareMessage + ' ' + certificateUrl)}`);
        toast.success('Email client opened');
        break;
        
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareMessage)}&url=${encodeURIComponent(certificateUrl)}`);
        toast.success('Shared to Twitter');
        break;
        
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(certificateUrl)}&title=${encodeURIComponent('Umurage Certificate')}&summary=${encodeURIComponent(shareMessage)}`);
        toast.success('Shared to LinkedIn');
        break;
        
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(certificateUrl)}&quote=${encodeURIComponent(shareMessage)}`);
        toast.success('Shared to Facebook');
        break;
        
      case 'copy':
        navigator.clipboard.writeText(certificateUrl)
          .then(() => toast.success('Certificate link copied to clipboard'))
          .catch(() => toast.error('Failed to copy link'));
        break;
        
      default:
        break;
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-lg overflow-hidden"
      >
        {/* Certificate Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 py-6 px-8 text-white">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Certificate of Completion</h1>
            <div className="flex space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center px-4 py-2 bg-white text-indigo-700 rounded-lg font-medium shadow-sm hover:bg-gray-100 disabled:opacity-70 disabled:cursor-not-allowed"
                onClick={downloadCertificate}
                disabled={isDownloading}
              >
                <Download className="h-5 w-5 mr-2" />
                Download PDF
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center px-4 py-2 bg-white text-indigo-700 rounded-lg font-medium shadow-sm hover:bg-gray-100"
                onClick={() => setShowShareModal(true)}
              >
                <Share2 className="h-5 w-5 mr-2" />
                Share
              </motion.button>
            </div>
          </div>
        </div>
        
        {/* Certificate Content */}
        <div 
          ref={certificateRef}
          className="px-8 py-12 bg-white border-8 border-gray-100 m-6 rounded-lg"
        >
          <div className="text-center mb-8">
            <Award className="h-20 w-20 text-indigo-600 mx-auto mb-4" />
            <h2 className="text-4xl font-bold text-gray-900">Certificate of Achievement</h2>
            <p className="text-gray-600 mt-2 text-lg">This certifies that</p>
            <h3 className="text-3xl font-bold text-indigo-600 mt-3 mb-3">{user?.fullName || 'Student Name'}</h3>
            <p className="text-gray-600 text-lg">has successfully completed the course</p>
            <h4 className="text-2xl font-bold text-gray-900 mt-3">{certificate.courseName}</h4>
          </div>

          <div className="grid grid-cols-3 gap-6 mb-10">
            <div className="text-center p-4 border border-gray-100 rounded-lg">
              <p className="text-gray-600 text-sm mb-1">CERTIFICATE ID</p>
              <p className="font-bold">{certificate.id}</p>
              </div>
            <div className="text-center p-4 border border-gray-100 rounded-lg">
              <p className="text-gray-600 text-sm mb-1">GRADE ACHIEVED</p>
              <p className="font-bold">{certificate.grade}</p>
              </div>
            <div className="text-center p-4 border border-gray-100 rounded-lg">
              <p className="text-gray-600 text-sm mb-1">COMPLETION DATE</p>
              <p className="font-bold">{certificate.completionDate}</p>
            </div>
          </div>

          <div className="text-center border-t border-gray-100 pt-8 mt-8">
            <div className="flex items-center justify-center space-x-2 text-indigo-600 mb-4">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-medium">Verified by Umurage Learning Platform</span>
            </div>
            <p className="text-gray-600 text-sm">
              To verify this certificate, visit{' '}
              <a 
                href={`https://umurage.rw/verify-certificate/${certificate.id}`} 
                className="text-indigo-600 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                umurage.rw/verify-certificate/{certificate.id}
              </a>
            </p>
          </div>
        </div>
      </motion.div>
      
      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 max-w-md w-full"
          >
            <h3 className="text-xl font-bold mb-4">Share Your Certificate</h3>
            <p className="text-gray-600 mb-6">Choose how you want to share your achievement:</p>
            
            <div className="space-y-3">
              <button 
                onClick={() => shareCertificate('email')}
                className="w-full py-3 px-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 rounded-lg"
              >
                <span className="font-medium">Email</span>
                <Share2 className="h-5 w-5" />
              </button>
              
              <button 
                onClick={() => shareCertificate('twitter')}
                className="w-full py-3 px-4 flex items-center justify-between bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg"
              >
                <span className="font-medium">Twitter</span>
                <Share2 className="h-5 w-5" />
              </button>
              
              <button 
                onClick={() => shareCertificate('linkedin')}
                className="w-full py-3 px-4 flex items-center justify-between bg-blue-50 hover:bg-blue-100 text-blue-800 rounded-lg"
              >
                <span className="font-medium">LinkedIn</span>
                <Share2 className="h-5 w-5" />
              </button>
              
              <button 
                onClick={() => shareCertificate('facebook')}
                className="w-full py-3 px-4 flex items-center justify-between bg-indigo-50 hover:bg-indigo-100 text-indigo-800 rounded-lg"
              >
                <span className="font-medium">Facebook</span>
                <Share2 className="h-5 w-5" />
              </button>
              
              <button 
                onClick={() => shareCertificate('copy')}
                className="w-full py-3 px-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 rounded-lg"
              >
                <span className="font-medium">Copy Link</span>
              <Share2 className="h-5 w-5" />
              </button>
          </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowShareModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
          </div>
        </motion.div>
      </div>
      )}
    </div>
  );
}

export default CertificatePage;