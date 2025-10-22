import React, { useEffect, useMemo, useState } from 'react';
import { Spinner, Button, Modal, ModalBody, Form, Row, Col, Input, Label, ModalHeader } from 'reactstrap';
import TableContainer from 'Components/Common/TableContainerReactTable';

// Define the FavoriteSalon type based on your table structure
interface FavoriteSalon {
  id: number;
  UserId: string;
  SalonId: string;
  Status: string;
  device_id: string;
  created_at: string;
}

const FavoriteSalonTable: React.FC = () => {
  const [salonData, setSalonData] = useState<FavoriteSalon[]>([]);
  const [modal, setModal] = useState(false);
  const [newSalon, setNewSalon] = useState<FavoriteSalon | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      // Replace with your actual API call to fetch FavoriteSalon data
      const mockData: FavoriteSalon[] = [
        {
          id: 1,
          UserId: 'User1',
          SalonId: 'Salon1',
          Status: 'Active',
          device_id: 'Device1',
          created_at: '2024-10-18 12:00:00',
        },
        {
          id: 2,
          UserId: 'User2',
          SalonId: 'Salon2',
          Status: 'Inactive',
          device_id: 'Device2',
          created_at: '2024-10-17 11:00:00',
        },
      ];
      setSalonData(mockData);
    };

    fetchData();
  }, []);

  const columns = useMemo(
    () => [
      {
        header: "ID",
        accessorKey: 'id',
        enableColumnFilter: false,
      },
      {
        header: "User",
        accessorKey: 'UserId',
        enableColumnFilter: false,
      },
      {
        header: "Salon",
        accessorKey: 'SalonId',
        enableColumnFilter: false,
      },
      {
        header: "Status",
        accessorKey: 'Status',
        enableColumnFilter: false,
      },
      {
        header: "Device",
        accessorKey: 'device_id',
        enableColumnFilter: false,
      },
      {
        header: "Actions",
        accessorKey: 'actions',
        enableColumnFilter: false,
        cell: (cell: { row: { original: FavoriteSalon } }) => (
          <div>
            <i
              className="ri-edit-2-fill"
              style={{ cursor: "pointer", marginRight: "20px", color: "grey", fontSize: "20px" }}
              onClick={() => handleEdit(cell.row.original)}
            > </i>
            <i
              className=" ri-delete-bin-fill"
              style={{ cursor: "pointer", color: "grey", fontSize: "20px" }}
              onClick={() => handleDelete(cell.row.original.id)}
            > </i>
          </div>
        ),
      },
    ],
    []
  );

  const handleValidDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleEdit = (salon: FavoriteSalon) => {
    setNewSalon(salon);
    setModal(true);
  };

  const handleDelete = (id: number) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this entry?');
    if (confirmDelete) {
      setSalonData((prevData) => prevData.filter((item) => item.id !== id));
    }
  };

  const handleAddButtonClick = () => {
    setNewSalon({
      id: 0,
      UserId: '',
      SalonId: '',
      Status: 'Active',
      device_id: '',
      created_at: new Date().toISOString(),
    });
    setModal(true);
  };

  const toggleModal = () => {
    setModal(!modal);
  };
  const handleAddOrUpdateSalon = () => {
    if (newSalon) {
      if (newSalon.id === 0) {
        const newId = salonData.length ? salonData[salonData.length - 1].id + 1 : 1;
        setSalonData((prevData) => [
          ...prevData,
          { ...newSalon, id: newId },
        ]);
      } else {
        setSalonData((prevData) =>
          prevData.map((salon) => (salon.id === newSalon.id ? newSalon : salon))
        );
      }
      toggleModal();
    }
  };

  return (
    <React.Fragment>
      <Row className="g-2 mb-4">
        <Col sm={4}>
          <h5>Favorite Salon Management</h5>
        </Col>
        <Col className="col-sm-auto ms-auto align-botto">
          <Button color="success" onClick={handleAddButtonClick}>
            <i className="ri-add-fill me- align-bottom"></i> Add Favorite Salon
          </Button>
        </Col>
      </Row>
      {salonData.length === 0 ? (
        <Spinner />
      ) : (
        <TableContainer
          columns={columns}
          data={salonData}
          isGlobalFilter={true}
          customPageSize={50}
          SearchPlaceholder="Search..."
        />
      )}

      {/* Modal for adding/editing a salon */}
      <Modal isOpen={modal} toggle={toggleModal} centered
        backdrop="static" // Prevents closing on outside click
      >
        <ModalHeader className="modal-title"
          id="myModalLabel" toggle={() => {
            toggleModal();
          }}>
          {newSalon && newSalon.id ? 'Update Favorite Salon' : 'Add Favorite Salon'}
        </ModalHeader>
        <ModalBody>
          <Form onSubmit={(e) => e.preventDefault()}>
            <Row>
              <Col lg={12}>
                <div className="mb-3">
                  <Label htmlFor="UserId" className="form-label">User </Label>
                  <Input
                    type="text"
                    className="form-control"
                    id="UserId"
                    placeholder="Enter User ID"
                    value={newSalon?.UserId || ''}
                    onChange={(e) => setNewSalon({ ...newSalon, UserId: e.target.value } as FavoriteSalon)}
                  />
                </div>
              </Col>

              <Col lg={12}>
                <div className="mb-3">
                  <Label htmlFor="SalonId" className="form-label">Salon</Label>
                  <Input
                    type="text"
                    className="form-control"
                    id="SalonId"
                    placeholder="Enter Salon ID"
                    value={newSalon?.SalonId || ''}
                    onChange={(e) => setNewSalon({ ...newSalon, SalonId: e.target.value } as FavoriteSalon)}
                  />
                </div>
              </Col>
              <Col lg={12}>
                <div className="mb-3">
                  <Label htmlFor="Status" className="form-label">Status</Label>
                  <Input
                    type="select"
                    className="form-control"
                    id="Status"
                    value={newSalon?.Status || ''}
                    onChange={(e) => setNewSalon({ ...newSalon, Status: e.target.value } as FavoriteSalon)}
                  >
                    <option value="" disabled>Select Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="pending">Pending</option>
                    {/* Add more options as needed */}
                  </Input>
                </div>
              </Col>
              {/* Device ID Field */}
              <Col lg={12}>
                <div className="mb-3">
                  <Label htmlFor="device_id" className="form-label">Device</Label>
                  <Input
                    type="text"
                    className="form-control"
                    id="device_id"
                    placeholder="Enter Device ID"
                    value={newSalon?.device_id || ''}
                    onChange={(e) => setNewSalon({ ...newSalon, device_id: e.target.value } as FavoriteSalon)}
                  />
                </div>
              </Col>

              {/* Created At Field */}
              <Col lg={12}>
                <div className="mb-3">
                  <Label htmlFor="created_at" className="form-label">Created At</Label>
                  <Input
                    type="text"
                    className="form-control"
                    id="created_at"
                    placeholder="Enter Created At"
                    value={newSalon?.created_at || ''}
                    onChange={(e) => setNewSalon({ ...newSalon, created_at: e.target.value } as FavoriteSalon)}
                  />
                </div>
              </Col>

              <Col lg={12} className="hstack gap-2 justify-content-end">
                <Button className="btn btn-light" onClick={toggleModal}>
                  Cancel
                </Button>
                <Button color="primary" className="btn btn-success" onClick={handleAddOrUpdateSalon}>
                  Save
                </Button>
              </Col>
            </Row>
          </Form>
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
};

export default FavoriteSalonTable;
