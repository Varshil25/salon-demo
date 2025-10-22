import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


const Navdata = () => {
    const history = useNavigate();

    //state data
    const [isDashboard, setIsDashboard] = useState<boolean>(false);
    const [iscurrentState, setIscurrentState] = useState('Dashboard');

    // Get the user's role from localStorage (you can replace this with a global state if needed)
    const userRole = localStorage.getItem("userRole");
    let storeRoleInfo: any;
    if (userRole) {
        storeRoleInfo = JSON.parse(userRole);
    }
    function updateIconSidebar(e: any) {
        if (e && e.target && e.target.getAttribute("sub-items")) {
            const ul: any = document.getElementById("two-column-menu");
            const iconItems: any = ul.querySelectorAll(".nav-icon.active");
            let activeIconItems = [...iconItems];
            activeIconItems.forEach((item) => {
                item.classList.remove("active");
                var id = item.getAttribute("sub-items");
                const getID = document.getElementById(id) as HTMLElement;
                if (getID)
                    getID.classList.remove("show");
            });
        }
    }

    useEffect(() => {
        document.body.classList.remove('twocolumn-panel');
        if (iscurrentState !== 'Dashboard') {
            setIsDashboard(false);
        }

        if (iscurrentState === 'Widgets') {
            history("/widgets");
            document.body.classList.add('twocolumn-panel');
        }
        if (iscurrentState !== 'Landing') {
            //setIsLanding(false);
        }
    }, [
        history,
        iscurrentState,
        isDashboard,

    ]);

    const menuItems: any = [
        {
            label: "Menu",
            isHeader: true,
            allowedRoles: ['Admin', 'Barber', 'Salon Owner']
        },
        {
            id: "dashboard",
            label: "Dashboards",
            icon: "ri-dashboard-2-line",
            link: "/dashboard",
            stateVariables: isDashboard,
            click: function (e: any) {
                e.preventDefault();
                setIsDashboard(!isDashboard);
                setIscurrentState('Dashboard');
                updateIconSidebar(e);
            },
            allowedRoles: ['Admin', 'Barber', 'Salon Owner'] // All roles can see this
        },
        {
            id: "customers",
            label: "Customers",
            icon: "user ri-user-3-line",
            link: "/customer-table",
            click: function (e: any) {
                e.preventDefault();
                setIscurrentState('Customers');
            },
            allowedRoles: ['Admin', 'Salon Owner'] // Only Admin can see
        },
        {
            id: "users",
            label: "Users",
            icon: " ri-shield-user-fill",
            link: "/user-table",
            click: function (e: any) {
                e.preventDefault();
                setIscurrentState('Users');
            },
            allowedRoles: ['Admin'] // All roles can see this
        },
        {
            id: "barber",
            label: "Barber",
            icon: "ri-scissors-cut-line",
            link: "/barber-table",
            click: function (e: any) {
                e.preventDefault();
                setIscurrentState('Barber');
            },
            allowedRoles: ['Admin', 'Salon Owner'] // All roles can see this
        },
        {
            id: "barberSchedule",
            label: "Barber Schedule",
            icon: "ri-time-line",
            link: "/barber-schedule",
            click: function (e: any) {
                e.preventDefault();
                setIscurrentState('Barber Schedule');
            },
            allowedRoles: ['Admin', 'Salon Owner'] // All roles can see this
        },
        {
            id: "salon",
            label: "Salon",
            icon: "ri-store-line",
            link: "/salon-table",
            click: function (e: any) {
                e.preventDefault();
                setIscurrentState('Salon');
            },
            allowedRoles: ['Admin'] // All roles can see this
        },
        {
            id: "role",
            label: "Role",
            icon: "ri-user-2-fill",
            link: "/role-table",
            click: function (e: any) {
                e.preventDefault();
                setIscurrentState('Role');
            },
            allowedRoles: ['Admin'] // All roles can see this
        },
        {
            id: "board",
            label: "Board",
            icon: "ri-dashboard-fill",
            link: "/board-table",
            click: function (e: any) {
                e.preventDefault();
                setIscurrentState('Board');
            },
            allowedRoles: ['Admin', 'Barber', 'Salon Owner'] // All roles can see this
        },
        {
            id: "ourservice",
            label: "Our Service",
            icon: "ri-service-line",
            link: "/service-table",
            click: function (e: any) {
                e.preventDefault();
                setIscurrentState('Out Service');
            },
            allowedRoles: ['Admin'] // All roles can see this
        },
        {
            id: "appointment",
            label: "Appointment",
            icon: "ri-calendar-check-fill",
            link: "/appointment-table",
            click: function (e: any) {
                e.preventDefault();
                setIscurrentState('Appointment');
            },
            allowedRoles: ['Admin', 'Barber', 'Salon Owner'] // All roles can see this
        },
        // {
        //     id: "haircutdetails",
        //     label: "HaircutDetails",
        //     icon: "ri-scissors-2-fill",
        //     link: "/haircut-details-table",
        //     click: function (e: any) {
        //         e.preventDefault();
        //         setIscurrentState('HaircutDetails');
        //     }
        // },
        {
            id: "blog",
            label: "Blog",
            icon: "ri-book-open-line",
            link: "/blog-table",
            click: function (e: any) {
                e.preventDefault();
                setIscurrentState('Blog');
            },
            allowedRoles: ['Admin'] // All roles can see this
        },
        {
            id: "Insalonappointment",
            label: "In Salon Appointment",
            icon: "ri-calendar-check-line",
            link: "/Insalon-table",
            click: function (e: any) {
                e.preventDefault();
                setIscurrentState('Blog');
            },
            allowedRoles: ['Admin' , 'Salon Owner'] // All roles can see this
        },



        {/*
        id: "favoritesalon",
           label: "Favorite Salon",
          icon: "ri-heart-3-fill",
         link: "/favorite-salon-table",
         click: function (e: any) {
             e.preventDefault();
             setIscurrentState('Blog');
         }
     */}


    ];
    return <React.Fragment>
        {menuItems
            .filter((item: any) => { return item?.allowedRoles?.includes(storeRoleInfo?.role_name) })
            .map((item: any, index: number) =>
                item
            )}
    </React.Fragment>;
};
export default Navdata;