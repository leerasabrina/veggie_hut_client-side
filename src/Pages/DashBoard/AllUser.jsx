import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "../../Loader/Loader";

const AllUser= () => {
  const [searchText, setSearchText] = useState("");
  const queryClient = useQueryClient();
  const token = localStorage.getItem('token');

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["all-users", searchText],
    queryFn: async () => {
      const res = await axios.get(`https://server-side-nine-ruddy.vercel.app/users?search=${searchText}`,{
        headers:{
            Authorization:`Bearer ${token}`
          }
      });
      return res.data;
    },
  });
  console.log(users);

  const roleMutation = useMutation({
    mutationFn: async ({ id, role }) => {
      const res = await axios.patch(`https://server-side-nine-ruddy.vercel.app/users/${id}`, { role },{
        headers:{
            Authorization:`Bearer ${token}`,
            "Content-Type":'application/json',
          }
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success("User role updated!");
      queryClient.invalidateQueries(["all-users"]);
    },
  });



  const handleRoleChange = (id, role) => {
    roleMutation.mutate({ id, role });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    queryClient.invalidateQueries(["all-users"]);
  };

 
 
  

  return (
    <div className="p-5">
      <h2 className="text-2xl font-bold mb-4">All Users</h2>

      {/* Search */}
      <form onSubmit={handleSearch} className="mb-4">
        <input
          type="text"
          placeholder="Search by name or email"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="input input-bordered w-72 mr-2"
        />
        <button className="btn bg-[#007c00] text-white" type="submit">Search</button>
      </form>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th className="text-[#007c00] text-xl">Name</th>
              <th className="text-[#007c00] text-xl">Email</th>
              <th className="text-[#007c00] text-xl">Current Role</th>
              <th className="text-[#007c00] text-xl">Change Role</th>
            
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={5}><Loader></Loader></td></tr>
            ) : (
              users.map((user) => (
                <tr key={user._id}>
                  <td>{user.displayName}</td>
                  <td>{user.email}</td>
                  <td className="capitalize">{user.role}</td>
                  <td>
                    <select
                      defaultValue={user.role}
                      onChange={(e) => handleRoleChange(user._id, e.target.value)}
                      className="select select-bordered"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                      <option value="vendor">Vendor</option>
                    </select>
                  </td>
                  
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

     
    </div>
  );
};

export default AllUser;
