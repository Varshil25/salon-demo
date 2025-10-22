import React from "react";
import { Link } from "react-router-dom";
import moment from "moment";



const handleValidDate = (date: any) => {
    const date1 = moment(new Date(date)).format("DD MMM Y");
    return date1;
};


const UserID = (cell: any) => {

    return (
        <React.Fragment>
            <Link to="/apps-tasks-details" className="fw-medium link-primary">{cell.getValue()}</Link>
        </React.Fragment>
    );
};

const BarberID = (cell: any) => {
    return (
        <React.Fragment>
            <Link to="/apps-projects-overview" className="fw-medium link-primary">{cell.getValue()}</Link>
        </React.Fragment>
    );
};

const DeviceId = (cell: any) => {
    return (
        <React.Fragment>

            <Link to="/apps-tasks-details">
                <i className="ri-eye-fill align-bottom me-2 text-muted"></i>{cell.getValue()}
            </Link>

        </React.Fragment>
    );
};

const SalonId = (cell: any) => {
    return (
        <React.Fragment>
            {cell.getValue()}
        </React.Fragment>
    );
};

const NumberOfPeople = (cell: any) => {
    return (
        <React.Fragment>
            {cell.getValue()}
        </React.Fragment>
    );
};


const Status = (cell: any) => {
    const data = cell.row.original; // Assuming you are passing the entire row data to the cell.
    let status = null;

    // Check conditions based on the time values
    if (data.status === "in_salon") {
        status = "In salon"; // Check-in time but no in-salon time
    } else if (data.status === "canceled") {
        status = "Canceled"; // In-salon time but no completion time
    } else if (data.status === "completed") {
        status = "Completed"; // Completed time exists
    } else if (data.status === "checked_in") {
        status = "Checked In"; // Cancel time exists
    }

    // Render the badge based on the status
    return (
        <React.Fragment>
            {status === "In salon" ? (
                <span className="badge bg-secondary-subtle text-secondary text-uppercase">{status}</span>
            ) : status === "Checked In" ? (
                <span className="badge bg-warning-subtle text-warning text-uppercase">{status}</span>
            ) : status === "Completed" ? (
                <span className="badge bg-success-subtle text-success text-uppercase">{status}</span>
            ) : status === "Canceled" ? (
                <span className="badge bg-danger-subtle text-danger text-uppercase">{status}</span>
            ) : null}
        </React.Fragment>
    );
};

const Position = (cell: any) => {
    return (
        <React.Fragment>
            {cell.getValue()}
        </React.Fragment>
    );

    // const value = cell.getValue(); // Get the value of the queue position
    // const rowData = cell.row.original; // Get the full row data
    // const appointmentsCount = rowData.appointments || 0; // Assuming the number of appointments is stored in `appointments`

    // return (
    //     <React.Fragment>
    //         {value && (
    //             <span>
    //                 {value} - {appointmentsCount} Appointment{appointmentsCount !== 1 ? 's' : ''}
    //             </span>
    //         )}
    //     </React.Fragment>
    // );
};


const EstimatTime = (cell: any) => {
    // Assuming the value is in minutes or needs to be converted from seconds, etc.
    const formatEstimatedTime = (time: number) => {
        if (time > 60) {
            const hours = Math.floor(time / 60);
            const minutes = time % 60;
            return `${hours}h ${minutes}m`;
        }
        return `${time} minutes`;
    };

    return (
        <React.Fragment>
            {formatEstimatedTime(cell.getValue())} {/* Format the estimated time */}
        </React.Fragment>
    );
};
const CreatedDate = (cell: any) => {
    return (
        <React.Fragment>
            {handleValidDate(cell.getValue())}
        </React.Fragment>
    );
};

// const Status = (cell:any) => {
//     return (
//         <React.Fragment>
//             {cell.getValue() === "Inprogress" ?
//                 <span className="badge bg-secondary-subtle text-secondary text-uppercase">{cell.getValue()}</span>
//                 :
//                 cell.getValue() === "New" ?
//                     <span className="badge bg-info-subtle text-info text-uppercase">{cell.getValue()}</span>
//                     : cell.getValue() === "Completed" ?
//                         <span className="badge bg-success-subtle text-success text-uppercase">{cell.getValue()}</span>
//                         : cell.getValue() === "Pending" ?
//                             <span className="badge bg-warning-subtle text-warning text-uppercase">{cell.getValue()}</span>
//                             : null
//             }
//         </React.Fragment>
//     );
// };



export { UserID, BarberID, DeviceId, SalonId, NumberOfPeople, EstimatTime, CreatedDate, Status, Position };