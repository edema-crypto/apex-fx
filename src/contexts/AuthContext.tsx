import React, { createContext, useContext, useState, useEffect } from 'react';

interface Transaction {
  id: string;
  amount: number;
  description: string;
  status: 'pending' | 'success' | 'denied';
  timestamp: Date;
  type: 'credit' | 'debit';
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  balance: number;
  initialBalance: number;
  avatar?: string;
  transactions: Transaction[];
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdminAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  adminLogin: (email: string, password: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'timestamp'>) => void;
  getUsers: () => User[];
}

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users data - starting with clean slate
const mockUsers: User[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    balance: 0,
    initialBalance: 0,
    avatar: null,
    transactions: []
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [users, setUsers] = useState<User[]>(mockUsers);

  // Check for existing session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('apexfx_user');
    const savedAdminAuth = localStorage.getItem('apexfx_admin_auth');
    const savedUsers = localStorage.getItem('apexfx_users');
    
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    }
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
    
    if (savedAdminAuth === 'true') {
      setIsAdminAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock authentication - in real app, this would call an API
    if (email && password.length >= 8) {
      // Find existing user or create new one
      let userData = users.find(u => u.email === email);
      if (!userData) {
        userData = {
          id: Date.now().toString(),
          firstName: 'User',
          lastName: '',
          email,
          balance: 0,
          initialBalance: 0,
          avatar: null,
          transactions: []
        };
        const newUsers = [...users, userData];
        setUsers(newUsers);
        localStorage.setItem('apexfx_users', JSON.stringify(newUsers));
      }
      
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('apexfx_user', JSON.stringify(userData));
      
      // After login, if onboarding hasn't been completed, redirect
      const hasOnboarded = localStorage.getItem('apexfx_onboarded') === 'true';
      if (!hasOnboarded) {
        localStorage.setItem('apexfx_redirect_after_login', '/onboarding');
      }
      return true;
    }
    return false;
  };

  const adminLogin = async (email: string, password: string): Promise<boolean> => {
    if (email === 'admin@apexfx.com' && password === 'ApexFX@Secure2025') {
      setIsAdminAuthenticated(true);
      localStorage.setItem('apexfx_admin_auth', 'true');
      return true;
    }
    return false;
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    // Mock registration - in real app, this would call an API
    try {
      const newUser: User = {
        id: Date.now().toString(),
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        balance: 0,
        initialBalance: 0,
        avatar: null,
        transactions: []
      };
      
      const newUsers = [...users, newUser];
      setUsers(newUsers);
      localStorage.setItem('apexfx_users', JSON.stringify(newUsers));
      
      setUser(newUser);
      setIsAuthenticated(true);
      localStorage.setItem('apexfx_user', JSON.stringify(newUser));
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('apexfx_user');
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('apexfx_user', JSON.stringify(updatedUser));
      
      // Update in users array
      const updatedUsers = users.map(u => u.id === user.id ? updatedUser : u);
      setUsers(updatedUsers);
      localStorage.setItem('apexfx_users', JSON.stringify(updatedUsers));
    }
  };

  const addTransaction = (transactionData: Omit<Transaction, 'id' | 'timestamp'>) => {
    if (user) {
      const transaction: Transaction = {
        id: Date.now().toString(),
        ...transactionData,
        timestamp: new Date()
      };

      // Calculate balance change based on status
      let balanceChange = 0;
      if (transaction.status === 'success') {
        balanceChange = transaction.type === 'credit' ? transaction.amount : -transaction.amount;
      }

      // Update user balance
      const newBalance = user.balance + balanceChange;
      
      // Set initial balance if this is the first transaction
      const currentTransactions = user.transactions || [];
      const newInitialBalance = currentTransactions.length === 0 ? newBalance : user.initialBalance;

      const updatedUser = {
        ...user,
        balance: newBalance,
        initialBalance: newInitialBalance,
        transactions: [transaction, ...currentTransactions]
      };

      setUser(updatedUser);
      localStorage.setItem('apexfx_user', JSON.stringify(updatedUser));
      
      // Update in users array
      const updatedUsers = users.map(u => u.id === user.id ? updatedUser : u);
      setUsers(updatedUsers);
      localStorage.setItem('apexfx_users', JSON.stringify(updatedUsers));
    }
  };

  const getUsers = () => {
    return users;
  };

  const value = {
    user,
    isAuthenticated,
    isAdminAuthenticated,
    login,
    adminLogin,
    register,
    logout,
    updateUser,
    addTransaction,
    getUsers
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};