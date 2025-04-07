import { useEffect, useState } from 'react';
import './App.css';
import { SupervisorT } from './utils/types.ts';

function App() {
    const [supervisors, setSupervisors] = useState<SupervisorT[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchSupervisors = async () => {
        const res = await fetch('https://supervisor-back.onrender.com/supervisors');
        if (!res.ok) {
            throw new Error('Failed to fetch supervisors');
        }
        return await res.json();
    };

    const handleNotify = (firstName: string, lastName: string, email: string) => {
        if (!isValidEmail(email)) {
            alert('Error sending notification, Invalid email!');
            return;
        }

        fetch('https://supervisor-back.onrender.com/supervisors/notify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ firstName, lastName, email }),
        })
            .then(() =>
                alert(
                    `Notification sent
                    First name: ${firstName}
                    Last name: ${lastName}
                    Email: ${email}`
                )
            )
            .catch(() => alert('Error sending notification'));
    };

    const isValidEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    useEffect(() => {
        setLoading(true);
        fetchSupervisors()
            .then(setSupervisors)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="p-3 mt-4 bg-light rounded shadow-lg">
            {loading ? (
                <div className="d-flex justify-content-center my-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : (
                <>
                    <h3 className="text-center text-primary">Supervisors</h3>

                    <div className="table-responsive">
                        <table className="table table-hover table-bordered">
                            <thead className="thead-light">
                            <tr>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Jurisdiction</th>
                                <th>Id</th>
                                <th>Phone</th>
                                <th>IdentificationNumber</th>
                                <th>Action</th>
                            </tr>
                            </thead>
                            <tbody>
                            {supervisors.map((s) => (
                                <tr key={s.identificationNumber}>
                                    <td>{s.firstName}</td>
                                    <td>{s.lastName}</td>
                                    <td>{s.jurisdiction}</td>
                                    <td>{s.id}</td>
                                    <td>{s.phone}</td>
                                    <td>{s.identificationNumber}</td>
                                    <td className="d-flex justify-content-center">
                                        <button
                                            className="btn btn-outline-primary btn-sm me-2 fa fa-envelope"
                                            onClick={() =>
                                                handleNotify(
                                                    s.firstName,
                                                    s.lastName,
                                                    `${s.firstName + s.lastName + s.id}@gmail.com`
                                                )
                                            }
                                            title="Notify"
                                        ></button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
}

export default App;
