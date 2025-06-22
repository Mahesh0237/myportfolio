'use client'
import Image from 'next/image';
import React from 'react';
import { useState } from 'react';
import { IconBellFilled, IconLogout2, IconUser } from '@tabler/icons-react';
import { Loadingoverlay, Menu } from '@nayeshdaggula/tailify';
import { useRouter } from 'next/navigation';
import { useEmployeDetails } from '@/components/zustand/useEmployeDetails';

function Topbarwrapper() {
  const employee_info = useEmployeDetails(state => state.employe_info);
  const [isOpen, setIsOpen] = useState(false);
  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  const resetAuthdetails = useEmployeDetails(state => state.resetAuthDetails);
  const router = useRouter()

  const [isLoadingEffect, setIsLoadingEffect] = useState(false)
  const handleLogoutUser = async () => {
    setIsLoadingEffect(true)
    try {
      const response = await fetch('/cookiesapi/admincookies', {
        method: 'POST',
      });

      const data = await response.json();

      if (data.status === 'success') {
        setIsLoadingEffect(false)
        router.push('/admin');
        resetAuthdetails();
      } else {
        console.error('Error logging out:', data);
        setIsLoadingEffect(false);
        return false
      }
    } catch (error) {
      setIsLoadingEffect(false)
      console.error('Error logging out:', error);
    }
  };

  return (
    <>
      {isLoadingEffect && (
        <div className='fixed inset-0 w-full h-full bg-[#2b2b2bcc] flex flex-row justify-center items-center z-[9999]'>
          <Loadingoverlay visible={isLoadingEffect} overlayBg='' />
        </div>
      )}
      <div className='bg-white w-full h-[70px] border-b border-[#DBDBDB] flex items-center justify-start px-6 '>
        <div className='flex flex-row items-center justify-between w-full'>
          <div className="  flex flex-row items-center gap-3 ml-auto  mx-2">
            <IconBellFilled size={20} className=' ml-auto mr-2 sm:hidden md:block' />
          </div>
          {/* <div className="relative cursor-pointer  flex flex-row items-center gap-2 text-left "
          onClick={toggleAccordion}>

          <p className='text-[14px] italic text-[#2b2b2b] font-semibold'>
            {employee_info?.name ? employee_info.name : 'Admin'}
          </p>
          <Image
            src={profile}
            alt='profile'
            className="h-10 w-10 rounded-full inline-flex justify-center "
          />
          <IconCaretDownFilled color='#2b2b2b' stroke={1.5} size={18} />
          {isOpen && (
            <div
              className="absolute right-0 z-10 mt-60 w-32 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="menu-button"
              tabIndex="-1"
            >
              <div className="py-1" role="none">
                <Link href="#" className="block px-4 py-2 text-sm text-gray-700" role="menuitem" tabIndex="-1" id="menu-item-0">My Profile</Link>
                <button onClick={handleLogoutUser} className="cursor-pointer block w-full px-4 py-2 text-left text-sm text-gray-700" role="menuitem" tabIndex="-1" id="menu-item-3">Log Out</button>
              </div>
            </div>
          )}
        </div> */}
          <Menu shadow="md" width={200}>
            <Menu.Target>
              <div className="flex items-center gap-2 cursor-pointer" >
                <h3 className="text-sm sm:text-base font-medium text-gray-800">
                  {employee_info?.name ? employee_info.name : 'Admin'}
                </h3>
                <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-[#044093] overflow-hidden">
                  {
                    employee_info?.profile_pic ? (
                      <Image
                        width={75}
                        height={75}
                        src={employee_info?.profile_pic ? employee_info?.profile_pic : null} // You can dynamically insert user image here
                        alt="Profile"
                        className="w-[75px] h-[75px] object-cover"
                      />
                    ) : (
                      <IconUser width={"100%"} height={"100%"} className="p-1" color='#fff' />
                    )}
                </div>
              </div>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item >
                <div className="flex items-center gap-2">
                  <IconUser size={14} />
                  <span>Profile</span>
                </div>
              </Menu.Item>
              <Menu.Item
                color="red"
                leftSection={<IconLogout2 size={14} />}
                onClick={handleLogoutUser}
              >
                Logout
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </div>
      </div>
    </>
  );
}

export default Topbarwrapper