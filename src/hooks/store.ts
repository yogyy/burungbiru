import { create } from "zustand";

type TweetModal = {
  show: boolean;
  setShow: (show: React.SetStateAction<boolean>) => void;
};

const useTweetModal = create<TweetModal>((set) => ({
  show: false,
  setShow: () => set((state) => ({ show: !state.show })),
}));

export { useTweetModal };
