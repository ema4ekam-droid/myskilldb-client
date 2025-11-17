import React from 'react';
import { AddEditContactModal, ContactDetailModal, EmailTemplatesModal } from '../mentors-components';


const ModalWrapper = ({ modalView, onClose, ...props }) => {
  if (!modalView) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[9998]"
        onClick={onClose}
      ></div>

      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        {modalView === 'add' && (
          <AddEditContactModal
            isOpen={true}
            onClose={onClose}
            {...props}
          />
        )}
        
        {modalView === 'detail' && (
          <ContactDetailModal
            isOpen={true}
            onClose={onClose}
            contact={props.selectedContact}
          />
        )}
        
        {modalView === 'templates' && (
          <EmailTemplatesModal
            isOpen={true}
            onClose={onClose}
            templates={props.emailTemplates}
          />
        )}
      </div>
    </>
  );
};

export default ModalWrapper;

