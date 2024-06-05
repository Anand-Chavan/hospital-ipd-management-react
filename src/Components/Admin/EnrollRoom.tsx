import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface EnrollRoomProps {
    onClose: () => void;
    onSuccess: (newRoom: any) => void;
    mode: string;
    rowData?: any;
}

interface RoomData {
    room_type: string;
    description: string;
    charges: number;
    capacity: number;
}

const EnrollRoom: React.FC<EnrollRoomProps> = ({ onClose, onSuccess, mode, rowData }) => {
    const initialValues: RoomData = {
        room_type: '',
        description: '',
        charges: 0,
        capacity: 0,
    };

    const validationSchema = Yup.object({
        room_type: Yup.string().required('Room type is required'),
        description: Yup.string().required('Description is required'),
        charges: Yup.number().required('Charges are required').min(0, 'Charges must be at least 0'),
        capacity: Yup.number().required('Capacity is required').min(1, 'Capacity must be at least 1').max(100, 'Capacity cannot exceed 100'),
    });

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: async (values) => {
            if (mode === 'add') {
                await handleAdd(values);
            } else if (mode === 'edit') {
                await handleEdit(values);
            }
        },
    });

    useEffect(() => {
        if (mode === 'edit' && rowData) {
            formik.setValues({
                room_type: rowData.room_type || '',
                description: rowData.description || '',
                charges: rowData.charges || 0,
                capacity: rowData.capacity || 0,
            });
        }
    }, [mode, rowData]);

    const handleAdd = async (values: RoomData) => {
        try {
            const requestBody = {
                room: values,
            };

            const response = await fetch('http://localhost:3000/rooms', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token') as string
                },
                body: JSON.stringify(requestBody),
            });
            const data = await response.json();
            if (data?.status?.errors && data?.status?.errors.length > 0) {
                data.status.errors.forEach((ele: string) => {
                    toast.error(ele);
                });
            } else {
                onSuccess(data);
                toast.success('Room added successfully!');
                onClose();
            }
        } catch (error) {
            console.error('Error adding room:', error);
        }
    };

    const handleEdit = async (values: RoomData) => {
        try {
            const requestBody = {
                room: values,
            };

            const response = await fetch(`http://localhost:3000/rooms/${rowData.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token') as string
                },
                body: JSON.stringify(requestBody),
            });
            const data = await response.json();
            onSuccess(data);
            toast.success('Room updated successfully!');
            onClose();
        } catch (error) {
            console.error('Error updating room:', error);
        }
    };

    return (
        <div className="modal" style={{ display: 'block' }}>
            <div className="modal-content">
                <div className='row'>
                    <div className='col-2'></div>
                    <div className='col-8 text-center'>
                        <h2>{mode === 'add' ? 'Add' : 'Update'} Room</h2>
                    </div>
                    <div className='col-2'>
                        <span className="close" onClick={onClose}>&times;</span>
                    </div>
                </div>

                <div className="form-container">
                    <form onSubmit={formik.handleSubmit}>
                        <div className="input-group">
                            <label htmlFor="room_type">Room Type</label>
                            <select
                                id="room_type"
                                {...formik.getFieldProps('room_type')}
                                required
                            >
                                <option value="">Select Room Type</option>
                                <option value="Single">Single</option>
                                <option value="Double">Double</option>
                                <option value="Suite">Suite</option>
                            </select>
                            {formik.touched.room_type && formik.errors.room_type ? (
                                <label className="error-message">{formik.errors.room_type}</label>
                            ) : null}
                        </div>
                        <div className="input-group">
                            <label htmlFor="description">Description</label>
                            <input
                                id="description"
                                type="text"
                                {...formik.getFieldProps('description')}
                                placeholder="Description"
                                required
                            />
                            {formik.touched.description && formik.errors.description ? (
                                <label className="error-message">{formik.errors.description}</label>
                            ) : null}
                        </div>
                        <div className="input-group">
                            <label htmlFor="charges">Charges</label>
                            <input
                                id="charges"
                                type="number"
                                {...formik.getFieldProps('charges')}
                                placeholder="Charges"
                                min="0"
                                step="0.01"
                                required
                            />
                            {formik.touched.charges && formik.errors.charges ? (
                                <label className="error-message">{formik.errors.charges}</label>
                            ) : null}
                        </div>
                        <div className="input-group">
                            <label htmlFor="capacity">Capacity</label>
                            <input
                                id="capacity"
                                type="number"
                                {...formik.getFieldProps('capacity')}
                                placeholder="Capacity"
                                min="1"
                                max="100"
                                required
                            />
                            {formik.touched.capacity && formik.errors.capacity ? (
                                <label className="error-message">{formik.errors.capacity}</label>
                            ) : null}
                        </div>
                        <button type="submit" disabled={!formik.isValid} className="btn btn-primary">Submit</button>
                    </form>
                </div>
            </div>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                toastStyle={{ width: '400px' }}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </div>
    );
};

export default EnrollRoom;
