import React, { useEffect, useState } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Table } from "reactstrap";
import { AppointmentWaitlist } from "../../../../Services/appointment"; // Adjust the import path accordingly
import LoaderInner from "Components/Common/LoaderInner";
import { FaCheckCircle, FaMinusCircle, FaUser, FaUsers } from 'react-icons/fa';
interface PopupModalProps {
  isOpen: boolean;
  toggle: () => void;
  appointmentId?: number; // This is the new prop we are passing
}

interface ApiResponse {
  no: number;
  number_of_people: number;
  username: string;
  status: string;
  isCurrentUser: boolean;
}

const WaitlistPopup: React.FC<PopupModalProps> = ({
  isOpen,
  toggle,
  appointmentId,
}) => {
  const [waitlistData, setWaitlistData] = useState<ApiResponse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
     
      try {
        if (appointmentId) {
          setIsLoading(true); // Set loading to true when fetching starts
          const response = await AppointmentWaitlist(`${appointmentId}`); // Pass appointmentId as a string
          
          const data = response.data; // Define data without "any" if TypeScript typing is available
          
          setWaitlistData(data); // Assuming response.data is the waitlist array
          
          setIsLoading(false); // Set loading to false after data is fetched
        }
      } catch (error) {
        console.error("Error fetching waitlist data:", error);
        setIsLoading(false); // Ensure loading is false if there is an error
      }
    };
  
    if (isOpen && appointmentId) {
      fetchData(); // Fetch data when modal is open and appointmentId is available
    }
  }, [isOpen, appointmentId]);



  
  
  function renderPeopleIcons(peopleCount: any): React.ReactNode | Iterable<React.ReactNode> {
    throw new Error("Function not implemented.");
  }

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered>
      <ModalHeader toggle={toggle}>Waitlist</ModalHeader>
      {isLoading && <LoaderInner />}

      <ModalBody>
        <Table>
          <thead>
            <tr>
              <th>No.</th>
              <th>Guest</th>
              <th>
              <div style={{ }}>
          <FaUsers style={{ color: "#000000", fontSize: "1.3rem" }} />
        </div>
              </th>
  
              <th>In Salon</th>
            </tr>
          </thead>
          <tbody>
            {waitlistData.map((user, index) => (
              <tr key={index}>
                <td>{user.no}</td>
                <td>{user.username}</td>
                <td style={{ paddingLeft:"15px"}}>{user.number_of_people}</td>
                <td>
                  {/* Conditionally render the icon based on status */}
                  {user.status === 'in_salon' ? 
                  ( <FaCheckCircle color="green" />) 
                  // : user.status === 'checked_in' ? (<FaMinusCircle color="gray" />) 
                  : 
                  (
                    <span></span> // In case there is no status or an unexpected value
                  )}             
                </td>
              </tr>      
            ))}

          </tbody>
        </Table>
      </ModalBody>
      <ModalFooter></ModalFooter>
    </Modal>
  );
};

export default WaitlistPopup;
