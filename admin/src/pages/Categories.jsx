import React from 'react'
import axios from 'axios'

import { useEffect, useState } from 'react'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'
import { useProducts } from '../hooks/useProducts'

function Categories({ token }) {

    const [list, setList] = useState([])
    const [newCategoryName, setNewCategoryName] = useState('')
    const { products } = useProducts()

    const fetchList = async () => {
      try {
  
        const response = await axios.get(backendUrl + '/category')
        if (response.data) {
          setList(response.data.categories);
        }
        else {
          toast.error(response.data.message)
        }      

        

      } catch (error) {
        console.log(error)
        toast.error(error.message)
      }
    }
  
    const removeProduct = async (id, productCount) => {
      const confirmMessage = productCount > 0 
        ? `Are you sure you want to delete this category? This will also delete ${productCount} product${productCount !== 1 ? 's' : ''} associated with it.`
        : 'Are you sure you want to delete this category?';

      if (window.confirm(confirmMessage)) {
        try {
          const response = await axios.delete(backendUrl + `/category/${id}`)       

          if (response.data) {
            toast.success(response.data.message)
            await fetchList();
          } else {
            toast.error(response.data.message)
          }
        } catch (error) {
          console.log(error)
          toast.error(error.message)
        }
      }
    }

    const addCategory = async () => {

        if(!newCategoryName) {
            toast.error("Category name can't be empty.");
            return;
        }

        try {
            const response = await axios.post(backendUrl + '/category', { name: newCategoryName });            

            console.log(response.data);
            
                if (response.data) {
                    toast.success(response.data.message);
                    setNewCategoryName();
                    await fetchList();
                } else {
                    toast.error(response.data.message);
                }
            
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };
  
    useEffect(() => {
      fetchList()
    }, [])

    const getProductCountForCategory = (categoryId) => {
        return products.filter(product => product.category === categoryId).length
    }

  return (
    <div className="p-4 md:p-6">
        <p className='mb-4 text-lg md:text-xl font-medium'>All Category Types</p>
        <div className='flex flex-col gap-4'>
            <div className='flex flex-col sm:flex-row gap-2'>
                <input
                    type='text'
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder='Enter category name'
                    className='flex-1 border rounded px-3 py-2 text-sm md:text-base'
                />
                <button 
                    onClick={addCategory} 
                    className='px-6 py-2 bg-black text-white hover:opacity-80 transition rounded text-sm md:text-base'
                >
                    Add
                </button>
            </div>

            <div className='overflow-x-auto shadow-sm rounded-lg'>
                <table className="w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-3 py-3 text-left text-xs md:text-sm font-medium text-gray-500">Name</th>
                            <th className="px-3 py-3 text-left text-xs md:text-sm font-medium text-gray-500">_id</th>
                            <th className="px-3 py-3 text-center text-xs md:text-sm font-medium text-gray-500">Products Count</th>
                            <th className="px-3 py-3 text-center text-xs md:text-sm font-medium text-gray-500">Action</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {list.map((item, index) => (
                            <tr key={index} className="text-sm">
                                <td className="border p-2">{item.name}</td>
                                <td className="border p-2">{item._id}</td>
                                <td className="border p-2 text-center">{getProductCountForCategory(item._id)}</td>
                                <td className="border p-2 text-center">
                                    <span 
                                        onClick={() => removeProduct(item._id, getProductCountForCategory(item._id))} 
                                        className="cursor-pointer text-lg text-red-500 hover:text-red-700"
                                    >
                                        X
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className='mt-6 p-4 bg-red-50 rounded-lg'>
                <h2 className='text-red-600 font-bold text-base md:text-lg mb-2'>WARNING</h2>
                <p className='text-xs md:text-lg'>
                    Removing a category will make the category set to <span className='font-bold'>&quot;Unknown&quot;</span> in products associated with it.
                </p>
            </div>
        </div>
    </div>
  )
}

export default Categories
