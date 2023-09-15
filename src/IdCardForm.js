import React, { useState } from 'react';
import './IdCardForm.css'; // Create this CSS file for styling
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { saveAs } from 'file-saver';
const IdCardForm = () => {
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [address, setAddress] = useState('');
  const [image, setImage] = useState(null);
  const [idCardImage, setIdCardImage] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  const generateIdCard = () => {
    if (!name || !dob || !address || !image) {
      alert('Please fill in all fields and upload an image.');
      return;
    }

    // Create a data URL for the uploaded image
    const reader = new FileReader();
    reader.onload = () => {
      const imgDataUrl = reader.result;

      // Create a canvas to generate the ID card
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = 400; // Adjust the canvas size as needed
      canvas.height = 250;
// Format the date of birth as "DDMMYYYY"
const dobFormatted = dob.toLocaleDateString('en-GB').replace(/\//g, '');

      // Draw the uploaded image on the canvas
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Add name and date of birth to the ID card
        ctx.font = 'bold 20px Arial';
        ctx.fillStyle = '#333';
        ctx.fillText(name, 30, canvas.height - 60);
        ctx.fillText(`DOB: ${dobFormatted}`, 30, canvas.height - 30);


        // Convert the canvas to a data URL
        const idCardDataURL = canvas.toDataURL('image/png');

        // Set the generated ID card image in state
        setIdCardImage(idCardDataURL);
      };
      img.src = imgDataUrl;
    };
    reader.readAsDataURL(image);
  };


  const saveIdCardImage = () => {
    if (!idCardImage || !name || !dob) {
      alert('Please generate the ID card image first.');
      return;
    }

    
    const dobFormatted = dob.toLocaleDateString('en-GB').replace(/\//g, '');
    // Generate a file name based on name and date of birth
    const fileName = `${name.replace(/\s/g, '_')}_${dobFormatted.replace(/\s/g, '_')}.png`;
  
    // Fetch the generated ID card image and save it with the calculated file name
    fetch(idCardImage)
      .then((response) => response.blob())
      .then((blob) => {
        saveAs(blob, fileName);
      });
  };

  return (
    <div className="id-card-form">
      <h1>ID Card Generator</h1>
      <div className="form-group">
        <label htmlFor="name">Name:</label>
        <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div className="form-group">
          <label htmlFor="dob">Date of Birth:</label>
          <DatePicker id="dob" selected={dob} onChange={(date) => setDob(date)} />
        </div>
      <div className="form-group">
        <label htmlFor="address">Address:</label>
        <input type="text" id="address" value={address} onChange={(e) => setAddress(e.target.value)} />
      </div>
      <div className="form-group">
        <label htmlFor="image">Upload Image:</label>
        <input type="file" accept="image/*" id="image" onChange={handleImageUpload} />
      </div>
      <button onClick={generateIdCard}>Preview</button>

      {idCardImage && (
        <div className="id-card-container">
          <img src={idCardImage} alt="ID Card" />
        </div>
      )}
      {idCardImage && (
        <button onClick={saveIdCardImage}>Save ID Card Image</button>
      )}
    </div>
    
  );
};

export default IdCardForm;
