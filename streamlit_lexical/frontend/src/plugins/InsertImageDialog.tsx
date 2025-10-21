import React, { useState } from 'react';
import Button from '../ui/Button';
import TextInput from '../ui/TextInput';
import FileInput from '../ui/FileInput';
import { DialogActions, DialogButtonsList } from '../ui/Dialog';
import type { InsertImagePayload } from './ImagesPlugin';

export interface InsertImageDialogProps {
  onInsert: (payload: InsertImagePayload) => void;
  onClose: () => void;
}

function InsertImageUriDialogBody({
  onClick,
}: {
  onClick: (payload: InsertImagePayload) => void;
}) {
  const [src, setSrc] = useState('');
  const [altText, setAltText] = useState('');

  const isDisabled = src === '';

  return (
    <>
      <TextInput
        label="Image URL"
        placeholder="i.e. https://source.unsplash.com/random"
        onChange={setSrc}
        value={src}
      />
      <TextInput
        label="Alt Text"
        placeholder="Descriptive alternative text"
        onChange={setAltText}
        value={altText}
      />
      <DialogActions>
        <Button
          disabled={isDisabled}
          onClick={() => onClick({altText, src})}>
          Confirm
        </Button>
      </DialogActions>
    </>
  );
}

function InsertImageUploadedDialogBody({
  onClick,
}: {
  onClick: (payload: InsertImagePayload) => void;
}) {
  const [src, setSrc] = useState('');
  const [altText, setAltText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const isDisabled = src === '' || isLoading;

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          // Create canvas for compression
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          if (!ctx) {
            reject(new Error('Could not get canvas context'));
            return;
          }

          // Set max dimensions
          const MAX_WIDTH = 1920;
          const MAX_HEIGHT = 1080;
          let width = img.width;
          let height = img.height;

          // Calculate new dimensions
          if (width > height) {
            if (width > MAX_WIDTH) {
              height = (height * MAX_WIDTH) / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width = (width * MAX_HEIGHT) / height;
              height = MAX_HEIGHT;
            }
          }

          // Set canvas dimensions
          canvas.width = width;
          canvas.height = height;

          // Draw and compress
          ctx.drawImage(img, 0, 0, width, height);
          
          // Convert to JPEG with 0.8 quality for better compression
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
          resolve(compressedDataUrl);
        };
        
        img.onerror = () => {
          reject(new Error('Failed to load image'));
        };
        
        img.src = e.target?.result as string;
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      
      reader.readAsDataURL(file);
    });
  };

  const loadImage = async (files: FileList | null) => {
    if (!files || !files[0]) {
      return;
    }

    const file = files[0];
    
    // Check file size (limit to 10MB)
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > MAX_FILE_SIZE) {
      alert('File is too large. Please select an image under 10MB.');
      return;
    }

    setIsLoading(true);
    
    try {
      const compressed = await compressImage(file);
      setSrc(compressed);
    } catch (error) {
      console.error('Error compressing image:', error);
      alert('Failed to load image. Please try a different file.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <FileInput
        label="Image Upload"
        onChange={loadImage}
        accept="image/*"
      />
      {isLoading && (
        <div style={{
          padding: '20px',
          textAlign: 'center',
          color: '#666',
          fontSize: '14px'
        }}>
          <div style={{
            display: 'inline-block',
            width: '40px',
            height: '40px',
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #0078d4',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            marginBottom: '10px'
          }} />
          <div>Compressing and optimizing image...</div>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      )}
      {src && !isLoading && (
        <div style={{padding: '10px'}}>
          <img 
            src={src} 
            alt="Preview" 
            style={{maxWidth: '100%', maxHeight: '200px', objectFit: 'contain'}}
          />
        </div>
      )}
      <TextInput
        label="Alt Text"
        placeholder="Descriptive alternative text"
        onChange={setAltText}
        value={altText}
      />
      <DialogActions>
        <Button
          disabled={isDisabled}
          onClick={() => onClick({altText, src})}>
          {isLoading ? 'Processing...' : 'Confirm'}
        </Button>
      </DialogActions>
    </>
  );
}

export default function InsertImageDialog({
  onInsert,
  onClose,
}: InsertImageDialogProps): JSX.Element {
  const [mode, setMode] = useState<null | 'url' | 'file'>(null);

  const onClick = (payload: InsertImagePayload) => {
    onInsert(payload);
    onClose();
  };

  return (
    <div className="dialog-content">
      {!mode && (
        <DialogButtonsList>
          <Button
            onClick={() => setMode('url')}>
            URL
          </Button>
          <Button
            onClick={() => setMode('file')}>
            File Upload
          </Button>
        </DialogButtonsList>
      )}
      {mode === 'url' && <InsertImageUriDialogBody onClick={onClick} />}
      {mode === 'file' && <InsertImageUploadedDialogBody onClick={onClick} />}
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </div>
  );
}
