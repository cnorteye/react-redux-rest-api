import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { verifyTokenAsync, userLogoutAsync } from "./../asyncActions/authAsyncActions";
import { userLogout, verifyTokenEnd } from "./../actions/authActions";

import { setAuthToken } from './../services/auth';
import { getToDoListService } from './../services/user';

function Dashboard() {

  const dispatch = useDispatch();
  const authObj = useSelector(state => state.auth);

  const { uid, token, client } = authObj;
  const [todoList, setTodoList] = useState([]);

  // handle click event of the logout button
  const handleLogout = () => {
    dispatch(userLogoutAsync());
  }

  // get user list
  const getTodoList = async () => {
    setAuthToken(token,client,uid);
    const result = await getToDoListService(token,client,uid);
    if (result.error) {
      dispatch(verifyTokenEnd());
      if (result.response && [401, 403].includes(result.response.status))
        dispatch(userLogout());
      return;
    }
    setTodoList(result.data)
  }

  /* set timer to renew token
  useEffect(() => {
    setAuthToken(token);
    const verifyTokenTimer = setTimeout(() => {
      dispatch(verifyTokenAsync(true));
    }, moment(expiredAt).diff() - 10 * 1000);
    return () => {
      clearTimeout(verifyTokenTimer);
    }
  }, [expiredAt, token]) */

  // get user list on page load
  useEffect(() => {
    getTodoList();
  }, []);

  return (

    <div>
    <h3 className= "font-italic" > Welcome {uid}!</h3><br />
    <div className='float-right'>
    <input className= "btn btn-warning" type="button" onClick={handleLogout} value="Logout" /><br /><br />
    </div>
    <input className= "btn btn-secondary" type="button" onClick={getTodoList} value="Get Data" /><br /><br />
    <h3 className="text-center"><b >To Do List:</b></h3>
    <pre>{JSON.stringify(todoList, null, 2)}</pre>
  </div>
  );
}

export default Dashboard;