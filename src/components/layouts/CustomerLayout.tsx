import { Outlet } from 'react-router-dom';
import CustomerTabNav from '@/components/CustomerTabNav';

const CustomerLayout = () => {
  return (
    <>
      <Outlet />
      <CustomerTabNav />
    </>
  );
};

export default CustomerLayout;
