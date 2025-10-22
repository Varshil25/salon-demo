import React from 'react';
import { Card, CardBody, Col } from 'reactstrap';
import CountUp from "react-countup";
import { taskWidgets } from '../../../../common/data';

const Widgets = (props: any) => {
    return (
        <React.Fragment>
            <Col xxl={4} sm={6}>
                <Card className="card-animate">
                    <CardBody>
                        <div className="d-flex justify-content-between">
                            <div>
                                <p className="fw-medium text-muted mb-0">Total Appointments</p>
                                <h2 className="mt-4 ff-secondary fw-semibold">
                                    <span className="counter-value">
                                        <CountUp
                                            start={0}
                                            end={props?.dashboard?.totalAppointments}
                                            // decimal={item.decimals}
                                            suffix=""
                                            duration={3}
                                        />
                                    </span>
                                </h2>
                                {/* <p className="mb-0 text-muted"><span className={"badge bg-light mb-0 text-" + item.badgeClass}>
                                        <i className={"align-middle " + item.badge}></i> {item.percentage}
                                    </span> vs. previous month</p> */}
                            </div>
                            <div>
                                <div className="avatar-sm flex-shrink-0">
                                    <span className={"avatar-title rounded-circle fs-4 bg-info-subtle text-info"}>
                                        <i className="ri-ticket-2-line"></i>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </Col>
            <Col xxl={4} sm={6}>
                <Card className="card-animate">
                    <CardBody>
                        <div className="d-flex justify-content-between">
                            <div>
                                <p className="fw-medium text-muted mb-0">Total Pending Appointments</p>
                                <h2 className="mt-4 ff-secondary fw-semibold">
                                    <span className="counter-value">
                                        <CountUp
                                            start={0}
                                            end={props?.dashboard?.pendingAppointmentsCount}
                                            // decimal={item.decimals}
                                            suffix=""
                                            duration={3}
                                        />
                                    </span>
                                </h2>
                                {/* <p className="mb-0 text-muted"><span className={"badge bg-light mb-0 text-" + item.badgeClass}>
                                        <i className={"align-middle " + item.badge}></i> {item.percentage}
                                    </span> vs. previous month</p> */}
                            </div>
                            <div>
                                <div className="avatar-sm flex-shrink-0">
                                    <span className={"avatar-title rounded-circle fs-4 bg-warning-subtle text-warning"}>
                                        <i className="mdi mdi-timer-sand"></i>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </Col>
            <Col xxl={4} sm={6}>
                <Card className="card-animate">
                    <CardBody>
                        <div className="d-flex justify-content-between">
                            <div>
                                <p className="fw-medium text-muted mb-0">Total Running Appointments</p>
                                <h2 className="mt-4 ff-secondary fw-semibold">
                                    <span className="counter-value">
                                        <CountUp
                                            start={0}
                                            end={props?.dashboard?.activeAppointmentsCount}
                                            // decimal={item.decimals}
                                            suffix=""
                                            duration={3}
                                        />
                                    </span>
                                </h2>
                                {/* <p className="mb-0 text-muted"><span className={"badge bg-light mb-0 text-" + item.badgeClass}>
                                        <i className={"align-middle " + item.badge}></i> {item.percentage}
                                    </span> vs. previous month</p> */}
                            </div>
                            <div>
                                <div className="avatar-sm flex-shrink-0">
                                    <span className={"avatar-title rounded-circle fs-4 bg-info-subtle text-info"}>
                                        <i className="ri-coupon-4-fill"></i>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </Col>
            <Col xxl={4} sm={6}>
                <Card className="card-animate">
                    <CardBody>
                        <div className="d-flex justify-content-between">
                            <div>
                                <p className="fw-medium text-muted mb-0">Total Completed Appointments</p>
                                <h2 className="mt-4 ff-secondary fw-semibold">
                                    <span className="counter-value">
                                        <CountUp
                                            start={0}
                                            end={props?.dashboard?.completedAppointmentsCount}
                                            // decimal={item.decimals}
                                            suffix=""
                                            duration={3}
                                        />
                                    </span>
                                </h2>
                                {/* <p className="mb-0 text-muted"><span className={"badge bg-light mb-0 text-" + item.badgeClass}>
                                        <i className={"align-middle " + item.badge}></i> {item.percentage}
                                    </span> vs. previous month</p> */}
                            </div>
                            <div>
                                <div className="avatar-sm flex-shrink-0">
                                    <span className={"avatar-title rounded-circle fs-4 bg-success-subtle text-success"}>
                                        <i className="ri-checkbox-circle-line"></i>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </Col>
            <Col xxl={4} sm={6}>
                <Card className="card-animate">
                    <CardBody>
                        <div className="d-flex justify-content-between">
                            <div>
                                <p className="fw-medium text-muted mb-0">Total Canceld Appointments</p>
                                <h2 className="mt-4 ff-secondary fw-semibold">
                                    <span className="counter-value">
                                        <CountUp
                                            start={0}
                                            end={props?.dashboard?.canceledAppointmentsCount}
                                            // decimal={item.decimals}
                                            suffix=""
                                            duration={3}
                                        />
                                    </span>
                                </h2>
                                {/* <p className="mb-0 text-muted"><span className={"badge bg-light mb-0 text-" + item.badgeClass}>
                                        <i className={"align-middle " + item.badge}></i> {item.percentage}
                                    </span> vs. previous month</p> */}
                            </div>
                            <div>
                                <div className="avatar-sm flex-shrink-0">
                                    <span className={"avatar-title rounded-circle fs-4 bg-danger-subtle text-danger"}>
                                        <i className="ri-delete-bin-line"></i>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </Col>
            {/* {taskWidgets.map((item, key) => (
                <Col xxl={3} sm={6} key={key}>
                    <Card className="card-animate">
                        <CardBody>
                            <div className="d-flex justify-content-between">
                                <div>
                                    <p className="fw-medium text-muted mb-0">{item.label}</p>
                                    <h2 className="mt-4 ff-secondary fw-semibold">
                                        <span className="counter-value">
                                            <CountUp
                                                start={0}
                                                end={item.counter}
                                                // decimal={item.decimals}
                                                suffix={item.suffix}
                                                duration={3}
                                            />
                                        </span>
                                    </h2>
                                    <p className="mb-0 text-muted"><span className={"badge bg-light mb-0 text-" + item.badgeClass}>
                                        <i className={"align-middle " + item.badge}></i> {item.percentage}
                                    </span> vs. previous month</p>
                                </div>
                                <div>
                                    <div className="avatar-sm flex-shrink-0">
                                        <span className={"avatar-title rounded-circle fs-4 bg-" + item.iconClass + "-subtle text-" + item.iconClass}>
                                            <i className={item.icon}></i>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </Col>
            ))} */}
        </React.Fragment>
    );
};

export default Widgets;