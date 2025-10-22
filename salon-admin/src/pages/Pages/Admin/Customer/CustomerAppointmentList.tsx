import React, { useMemo, useState } from "react";
import { NumberOfPeople, Position, Status } from "../Appointments/AppointmentListCol";
import TableContainer from "Components/Common/TableContainerReactTable";

const CustomerAppointmentList = ({ appointments }: any) => {

  const formatDate = (dateString: any) => {
    if (!dateString) return ""; // Return an empty string if dateString is invalid

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return ""; // Return an empty string if date is invalid

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${day}-${month}-${year}`;
  };

  // Set user data for editing
  const handleDetails = (details: any) => {
    // handleOpen();
    // setIsView(true); // Toggle edit mode
    // setSelectedHairCutDetails(details);
  };
  const columns = useMemo(
    () => [
      {
        header: "Full Name",
        accessorKey: "name",
        cell: (cell: any) => {
          return cell.getValue() ? cell.getValue() : "Unknown"; // Fallback if the barber is not found
        },
        enableColumnFilter: false,
      },
      {
        header: "Barber Name",
        accessorKey: "Barber.name",
        cell: (cell: any) => {
          return cell.getValue() ? cell.getValue() : "Unknown"; // Fallback if the barber is not found
        },
        enableColumnFilter: false,
      },
      {
        header: "Salon Name",
        accessorKey: "salon.name",
        enableColumnFilter: false,
      },
      {
        header: "Check In ",
        accessorKey: "check_in_time",
        cell: (cell: { getValue: () => string }) => formatDate(cell.getValue()),
        enableColumnFilter: false,
      },
      // {
      //   header: "Number Of People",
      //   accessorKey: "number_of_people",
      //   cell: (cell: any) => {
      //     return <NumberOfPeople {...cell} />;
      //   },
      //   enableColumnFilter: false,
      // },
      {
        header: "Status",
        accessorKey: "status",
        cell: (cell: any) => {
          return <Status {...cell} />;
        },
        enableColumnFilter: false,
      },

      // {
      //   header: "Queue Position",
      //   accessorKey: "queue_position",
      //   cell: (cell: any) => {
      //     return <Position {...cell} />;
      //   },
      //   enableColumnFilter: false,
      // },
      //  {
      //   header: "Details",
      //   accessorKey: "id",
      //   enableColumnFilter: false,

      //   cell: (cell: { getValue: () => number; row: { original: any } }) => (
      //     <div>
      //       <button
      //         type="button"
      //         className="btn btn-sm btn-light"
      //         onClick={() => handleDetails(cell.row.original)}
      //       >
      //         Details
      //       </button>
      //     </div>
      //   ),
      // },
    ],
    [appointments]
  );
  return (
    <React.Fragment>
      <TableContainer
        columns={columns}
        data={appointments || []}
        isGlobalFilter={true}
        customPageSize={100}
        divClass="table-responsive table-card mb-3"
        tableClass="align-middle table-nowrap mb-0"
        theadClass="table-light text-muted"
        SearchPlaceholder="Search by barber, salon or name" 
      />
      
    </React.Fragment>
  );
};

export default CustomerAppointmentList;
