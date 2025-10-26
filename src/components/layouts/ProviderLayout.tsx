import { Outlet } from 'react-router-dom';
import ProviderTabNav from '@/components/ProviderTabNav';

const ProviderLayout = () => {
  return (
    <>
      <Outlet />
      <ProviderTabNav />
    </>
  );
};

export default ProviderLayout;
