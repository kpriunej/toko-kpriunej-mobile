import { useSelector, useDispatch } from "react-redux";
import { login, logout } from "../redux/slices/authSlice";
import User from "../interfaces/User";

export default function useAuth() {
  const dispatch = useDispatch();
  const { user } = useSelector((
    state: {
      auth: {
        user: User | null
      }
    }
  ) => state.auth);

  /**
   * Check if the user has the specified role(s).
   * Accepts a single role string or multiple roles separated by '|'.
   * Returns true if the user has at least one of the specified roles.
   *
   * @param {string | string[]} roleName - Role(s) to check, either as a single string or an array of strings.
   * @returns {boolean} - True if the user has at least one of the specified roles, false otherwise.
   */
  function hasRole(roleName: string | string[]): boolean {
    const roles = Array.isArray(roleName)
      ? roleName
      : roleName.split('|').map(r => r.trim());
    return roles.some(role => user?.role?.includes(role));
  }

  /**
   * Set the authenticated user data in the Redux store.
   * This function can be called after a successful login to update the user state.
   *
   * @param {User} userData - The user data to set in the store, typically obtained from the login API response.
   * @returns {void}
   */
  const setUser = (userData: User): void => {
    dispatch(login({ user: userData }));
  };

  /**
   * Log out the user by clearing the authentication state in the Redux store.
   * This function can be called to log the user out, which will typically clear the user data and any authentication tokens.
   *
   * @returns {void}
   */
  const handleLogout = (): void => {
    dispatch(logout());
  };

  return { user, hasRole, setUser, handleLogout };
};
