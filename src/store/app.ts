// Utilities
import { defineStore } from 'pinia'
import jwtDecode from 'jwt-decode';

export type userType = {
  id: number;
  nome: string;
  sobrenome: string;
  tipo: {
      id: number;
      key: "gerente" | "cliente" | "vendedor",
      titulo: string
  }
};

export type RootState = {
  token: string | null;
  user: userType | null;
};


export const useAppStore = defineStore('app', {
  state: () => ({
    token: null,
    user: null
  } as RootState),
  getters: {
    isAuthenticated(state){
      if(!state.token){ return false; }
      const decoded = jwtDecode(state.token);
      if(!decoded){ return false; }
      const { exp } : { exp?: number } = decoded;
      const isValid = exp && exp >= (new Date().getTime() / 1000);
      return isValid;
    }
  },
  actions: {
    setToken( token: string | null ){
      this.token = token;
    }
  },
  persist: {
    storage: localStorage,
    paths: ['token']
  }
})
