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

  // get todo list
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

  // get tofo list on page load
  useEffect(() => {
    getTodoList();
  }, []);

  return (
       <div className="container">
          <div>
            <div className="row mb-5">
              <input className="btn btn-info" type="button" onClick={getTodoList} value="Get Data" />
              <p className="ml-auto">
                <b>Hello {uid}!</b>
                <input className="btn btn-danger ml-3" type="button" onClick={handleLogout} value="Logout" />
              </p>
            </div>
            <h2 className="text-center mb-4"> Your List of ToDo's:</h2>
          </div>
        <div className="row ">
        {todoList.map((todo, index) =>
            <div key={index} todo={todo} className="table">
              <div className="table-header bg-dark text-white text-center">
                <b>{todo.title}</b>
              </div>
              {todo.items.map(item =>
              <ul className="list-group-item">
                <li key={index} className={"list-group-item" + (item.done? 'done':'')}>
                  {item.name}
                </li>
              </ul>)}
            </div>
        )}
        </div>
    </div>
  );
}

export default Dashboard;