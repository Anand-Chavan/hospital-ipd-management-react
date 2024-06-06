import React, { useEffect, useState } from 'react';
import '../../Styles/Modal.css';
import '../../Styles/Room.css';
import { ToastContainer, toast } from 'react-toastify';
import * as Yup from 'yup';
import { useFormik } from 'formik';


interface EnrollStaffProps {
  onClose: () => void;
  onSuccess: (newStaff: any) => void;
  mode: string,
  rowData?: any
}

interface StaffData {
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: string;
  phone_no: string;
  email: string;
  password: string;
}

interface ApiResponseForUsers {
  status: {
    message: string;
    data: {
      id: number;
      email: string;
      created_at: string;
      updated_at: string;
      jti: string;
    };
    errors: []
  };
}


const EnrollStaff: React.FC<EnrollStaffProps> = ({ onClose, onSuccess, mode, rowData }) => {
  const [formData, setFormData] = useState<StaffData>({
    first_name: '',
    last_name: '',
    date_of_birth: '',
    gender: '',
    phone_no: '',
    email: '',
    password: ''
  });

  const initialValues: StaffData = {
    first_name: '',
    last_name: '',
    date_of_birth: '',
    gender: '',
    phone_no: '',
    email: '',
    password: ''
  };

  const validationSchema = Yup.object().shape({
    first_name: Yup.string().required('First name is required'),
    last_name: Yup.string().required('Last name is required'),
    date_of_birth: Yup.date().required('Date of birth is required'),
    gender: Yup.string().required('Gender is required'),
    phone_no: Yup.string().matches(/^\d{10}$/, 'Phone number must be 10 digits').required('Phone number is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async () => {
      if (mode == 'add')
        handleAdd();
      if (mode == 'edit')
        handleEdit();
    },
  });



  useEffect(() => {
    if (mode == 'edit') {
      const editObj = {
        first_name: rowData?.first_name,
        last_name: rowData?.last_name,
        date_of_birth: rowData?.date_of_birth,
        gender: rowData?.gender,
        phone_no: rowData?.phone_no,
        email: '',
        password: '',
      }
      setFormData(editObj)
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (mode == 'add')
      handleAdd();
    if (mode == 'edit')
      handleEdit();
  };



  const handleAdd = async () => {
    try {
      const requestBody = {
        "user": {
          "email": formData.email,
          "password": formData.password
        }
      }
      const responseForUser = await fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token') as string
        },
        body: JSON.stringify(requestBody),
      });
      const dataForUsers: ApiResponseForUsers = await responseForUser.json();
      if (dataForUsers.status.errors && dataForUsers.status.errors.length > 0) {
        dataForUsers.status.errors.forEach((ele: string) => {
          toast.success(ele)
        })
      }

      const requestBodyForUserDetails = {
        "user_detail": {
          "first_name": formData.first_name,
          "last_name": formData.last_name,
          "date_of_birth": formData.date_of_birth,
          "gender": formData.gender,
          "phone_no": formData.phone_no,
          "user_id": dataForUsers.status.data.id,
          "role_id": 2
        }
      }

      const responseForUserDetails = await fetch('http://localhost:3000/user_details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token') as string
        },
        body: JSON.stringify(requestBodyForUserDetails),
      });
      const dataForUserDetails = await responseForUserDetails.json();
      onSuccess(dataForUserDetails);
      toast.success('User Added successful!');
      onClose();
    } catch (error) {
      console.error('Error adding staff:', error);
    }
  }

  const handleEdit = async () => {
    try {
      const requestBodyForUserDetails = {
        "user_detail": {
          "first_name": formData.first_name,
          "last_name": formData.last_name,
          "date_of_birth": formData.date_of_birth,
          "gender": formData.gender,
          "phone_no": formData.phone_no,
          "user_id": rowData.user_id,
          "role_id": 2
        }
      }
      const responseForUserDetails = await fetch(`http://localhost:3000/user_details/${rowData.user_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token') as string
        },

        body: JSON.stringify(requestBodyForUserDetails),
      });
      onSuccess(responseForUserDetails);
      toast.success('User Updated successful!');
      onClose();
    } catch (error) {
      console.error('Error adding staff:', error);
    }
  }


  return (

    <div className="modal" style={{ display: 'block' }}>
      <div className="modal-content">
        <div className='row'>
          <div className='col-2'>
          </div>
          <div className='col-8 text-center'>
            <h2>{mode == 'add' ? 'Add' : 'Update'} Staff</h2>
          </div>
          <div className='col-2'>
            <span className="close" onClick={onClose}>&times;</span>
          </div>
        </div>
        <div className="form-container">
          <form onSubmit={formik.handleSubmit}>
            <div className="input-group">
              <label htmlFor="first_name">First Name</label>
              <input
                id='first_name'
                type="text"
                {...formik.getFieldProps('first_name')}
                placeholder="First Name"
                required
              />
              {formik.touched.first_name && formik.errors.first_name ? (
                <label className="error-message">{formik.errors.first_name}</label>
              ) : null}
            </div>
            <div className="input-group">
              <label htmlFor="last_name">Last Name</label>
              <input
                type="text"
                {...formik.getFieldProps('last_name')}
                placeholder="Last Name"
                required
              />
              {formik.touched.last_name && formik.errors.last_name ? (
                <label className="error-message">{formik.errors.last_name}</label>
              ) : null}
            </div>
            <div className="input-group">
              <label htmlFor="date_of_birth">Date of Birth</label>
              <input
                type="date"
                {...formik.getFieldProps('date_of_birth')}
                placeholder="Date of Birth"
                required
              />
              {formik.touched.date_of_birth && formik.errors.date_of_birth ? (
                <label className="error-message">{formik.errors.date_of_birth}</label>
              ) : null}
            </div>
            <div className="input-group">
              <label>Gender</label>
              <div>
                <label>
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={formData.gender === "male"}
                    onChange={handleChange}
                    required
                  />
                  Male
                </label>
                <label>
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={formData.gender === "female"}
                    onChange={handleChange}
                    required
                  />
                  Female
                </label>
              </div>
              {formik.touched.gender && formik.errors.gender ? (
                <label className="error-message">{formik.errors.date_of_birth}</label>
              ) : null}
            </div>
            <div className="input-group">
              <label htmlFor="phone_no">Phone Number</label>
              <input
                type="tel"
                {...formik.getFieldProps('phone_no')}
                placeholder="Phone Number"
                pattern="[0-9]{3}[0-9]{3}[0-9]{4}"
                required
              />
              {/* <small>Format: XXXXXXXXXX</small> */}
              {formik.touched.phone_no && formik.errors.phone_no ? (
                <label className="error-message">{formik.errors.phone_no}</label>
              ) : null}
            </div>
            {mode === 'add' && (
              <>
                <div className="input-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    {...formik.getFieldProps('email')}
                    placeholder="Email"
                    required
                  />
                  {formik.touched.email && formik.errors.email ? (
                    <label className="error-message">{formik.errors.email}</label>
                  ) : null}
                </div>
                <div className="input-group">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    {...formik.getFieldProps('password')}
                    placeholder="Password"
                    required
                  />
                  {formik.touched.password && formik.errors.password ? (
                    <label className="error-message">{formik.errors.password}</label>
                  ) : null}
                </div>
              </>
            )}
            <button type="submit" disabled={!formik.isValid} className="btn btn-primary">Submit</button>
          </form>
        </div>

        {/* <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} placeholder="First Name" />
          </div>
          <div className="input-group">
            <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} placeholder="Last Name" />
          </div>
          <div className="input-group">
            <input type="text" name="date_of_birth" value={formData.date_of_birth} onChange={handleChange} placeholder="Date of Birth" />
          </div>
          <div className="input-group">
            <input type="text" name="gender" value={formData.gender} onChange={handleChange} placeholder="Gender" />
          </div>
          <div className="input-group">
            <input type="text" name="phone_no" value={formData.phone_no} onChange={handleChange} placeholder="Phone Number" />
          </div>
          {mode === 'add' && (
            <>
              <div className="input-group">
                <input
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                />
              </div>
              <div className="input-group">
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                />
              </div>
            </>
          )}
          <button type="submit" className="btn btn-primary">Submit</button>
        </form> */}
      </div>
      <ToastContainer position="top-right"
        autoClose={5000}
        toastStyle={{ width: '400px' }}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"></ToastContainer>
    </div>
  );
};

export default EnrollStaff;
