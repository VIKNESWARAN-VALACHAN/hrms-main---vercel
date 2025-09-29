import React from 'react';
import { EmployeeData } from './types';
import { COUNTRY_CODES, NATIONALITIES } from '../../utils/countryData';
import { InputMask } from '@react-input/mask';

interface PersonalTabProps {
  formData: EmployeeData;
  onFormDataChange: (patch: Partial<EmployeeData>) => void;
  phoneMask: string;
  setPhoneMask: (mask: string) => void;
}

const PersonalTab: React.FC<PersonalTabProps> = ({
  formData,
  onFormDataChange,
  phoneMask,
  setPhoneMask,
}) => {
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    onFormDataChange({ [name]: value });
  };

  const handleCountryCodeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCode = e.target.value; // matches COUNTRY_CODES[i].code
    const selectedCountry = COUNTRY_CODES.find(country => country.code === selectedCode);
    if (selectedCountry) {
      setPhoneMask(selectedCountry.mask);
    }
    onFormDataChange({ country_code: selectedCode });
  };

  return (
    <div className="space-y-4">
      {/* Personal Information */}
      <h3 className="font-bold text-lg">Personal Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Full Name <span className="text-error">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="input input-bordered w-full"
            placeholder="Enter full name"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Email <span className="text-error">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="input input-bordered w-full"
            placeholder="Enter email address"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Gender <span className="text-error">*</span>
          </label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            className="select select-bordered w-full"
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Date of Birth <span className="text-error">*</span>
          </label>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleInputChange}
            className="input input-bordered w-full"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            IC/Passport No. <span className="text-error">*</span>
          </label>
          <input
            type="text"
            name="ic_passport"
            value={formData.ic_passport}
            onChange={handleInputChange}
            className="input input-bordered w-full"
            placeholder="Enter IC or Passport number"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Marital Status <span className="text-error">*</span>
          </label>
          <select
            name="marital_status"
            value={formData.marital_status}
            onChange={handleInputChange}
            className="select select-bordered w-full"
            required
          >
            <option value="">Select Marital Status</option>
            <option value="Single">Single</option>
            <option value="Married">Married</option>
            <option value="Divorced">Divorced</option>
            <option value="Widowed">Widowed</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Nationality <span className="text-error">*</span>
          </label>
          <select
            name="nationality"
            value={formData.nationality}
            onChange={handleInputChange}
            className="select select-bordered w-full"
            required
          >
            <option value="">Select Nationality</option>
            {NATIONALITIES.map((nat, index) => (
              <option key={index} value={nat}>
                {nat}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Race <span className="text-error">*</span>
          </label>
          <input
            type="text"
            name="race"
            value={formData.race}
            onChange={handleInputChange}
            className="input input-bordered w-full"
            placeholder="Enter race"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Religion <span className="text-error">*</span>
          </label>
          <input
            type="text"
            name="religion"
            value={formData.religion}
            onChange={handleInputChange}
            className="input input-bordered w-full"
            placeholder="Enter religion"
            required
          />
        </div>
      </div>

      <h3 className="font-bold text-lg mt-6">Contact Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Country Code <span className="text-error">*</span>
          </label>
          <select
            name="country_code"
            value={formData.country_code}
            onChange={handleCountryCodeChange}
            className="select select-bordered w-full"
            required
          >
            <option value="">Select Code</option>
            {COUNTRY_CODES.map((country, index) => (
              <option key={index} value={country.code}>
                {country.label} ({country.code})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Mobile Number <span className="text-error">*</span>
          </label>
          <InputMask
            mask={phoneMask}
            replacement={{ _: /\d/ }}
            name="mobile_number"
            value={formData.mobile_number}
            onChange={handleInputChange}
            className="input input-bordered w-full"
            placeholder="Enter mobile number"
            required
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">
            Address <span className="text-error">*</span>
          </label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            className="textarea textarea-bordered w-full"
            placeholder="Enter full address"
            rows={3}
            required
          ></textarea>
        </div>
      </div>

      <h3 className="font-bold text-lg mt-6">Emergency Contact</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Name <span className="text-error">*</span>
          </label>
          <input
            type="text"
            name="emergency_contact_name"
            value={formData.emergency_contact_name}
            onChange={handleInputChange}
            className="input input-bordered w-full"
            placeholder="Emergency contact name"
            required
          />
        </div>
        <div>
          <label className="block text sm font-medium mb-1">
            Relationship <span className="text-error">*</span>
          </label>
          <input
            type="text"
            name="emergency_contact_relationship"
            value={formData.emergency_contact_relationship}
            onChange={handleInputChange}
            className="input input-bordered w-full"
            placeholder="Relationship to employee"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Phone <span className="text-error">*</span>
          </label>
          <input
            type="text"
            name="emergency_contact_phone"
            value={formData.emergency_contact_phone}
            onChange={handleInputChange}
            className="input input-bordered w-full"
            placeholder="Emergency contact phone"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Email <span className="text-error">*</span>
          </label>
          <input
            type="email"
            name="emergency_contact_email"
            value={formData.emergency_contact_email}
            onChange={handleInputChange}
            className="input input-bordered w-full"
            placeholder="Emergency contact email"
            required
          />
        </div>
      </div>
    </div>
  );
};

export default PersonalTab;
