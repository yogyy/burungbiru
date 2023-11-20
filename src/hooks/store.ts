import { create } from "zustand";

type TYPE = {
  show: boolean;
  setShow: (show: React.SetStateAction<boolean>) => void;
};

const useTweetModal = create<TYPE>((set) => ({
  show: false,
  setShow: () => set((state) => ({ show: !state.show })),
}));

const useBurgerMenu = create<TYPE>((set) => ({
  show: false,
  setShow: () => set((state) => ({ show: !state.show })),
}));

export { useTweetModal, useBurgerMenu };
