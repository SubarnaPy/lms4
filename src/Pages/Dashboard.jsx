import React from 'react';
import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import { Spin } from 'antd';
import { motion } from 'framer-motion';
import Sidebar from '../Components/Dashboard/Sidebar';
import Layout from '../Layouts/HomeLayout';

const Dashboard = () => {
  const { loading: authLoading } = useSelector((state) => state.auth);
  const { loading: profileLoading } = useSelector((state) => state.profile);

  if (profileLoading || authLoading) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className='relative flex flex-col md:flex-row bg-[#f5f5f5]'
      >
        <Sidebar />
        <div className='flex-1 overflow-hidden bg-white shadow-soft rounded-lg m-4'>
          <div className='bg-white p-4 md:p-8'>
            <Outlet />
          </div>
        </div>
      </motion.div>
    </Layout>
  );
};

export default Dashboard;