// Utilities
import api from '@/services/api';
import { defineStore } from 'pinia'

export type userType = {
  id: number;
  nome: string;
  sobrenome: string;
  tipo: {
      id: number;
      key: "gerente" | "cliente" | "editor",
      titulo: string
  }
};

export type RootState = {
  user: userType | null;
};


export const useUserStore = defineStore('user', {
  state: () => ({
    user: null
  } as RootState),
  actions: {
    async init(){
      if(this.user){ return; }
      try {
        const user = await api({ requiresAuth: true }).get<any, userType>("/account/me");
        if( user ) {
          this.user = user;
        }
      } catch (err) {
        console.error(err);
      }
    },
    clear() {
      this.user = null;
    }
  },
  persist: {
    storage: sessionStorage
  }
})
