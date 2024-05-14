import { useState } from 'react';
import '../../Styles/sideBar.css';
import { AdminMenu, MenuItem } from '../../Utils/Constants';


const Sidebar = ({handleRouteFromApp}:any) => {
    const [selectedItem, setSelectedItem] = useState(AdminMenu[0]);


    const handleRoute = (item:any) => {
        handleRouteFromApp(item)
        setSelectedItem(item);
    }

    return (
        <div className="sidebar">
            <ul style={{ listStyleType: 'none','padding': '0px'}}>
                {AdminMenu.map((link, index) => (
                    <li key={index} style={{ padding: '7px',textAlign:'center',borderRadius:'10px',margin:'7px' }} className={selectedItem === link ? 'selected cp' : 'cp'} onClick={() => handleRoute(link)}>{link.name}</li>
                ))}
            </ul>
        </div>
    )
};

export default Sidebar;