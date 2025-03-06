import { create } from 'zustand';

export interface ModalState {
  ModalStates: {
    MAIN: {
      notification: boolean;
      purchase_success: boolean;
      purchase_loading: boolean;
      purchase_error: boolean;
    };

    PRICING: {
      alert: boolean;
      new: boolean;
      edit: boolean;
      detail: boolean;
      new_discount: boolean;
      edit_discount: boolean;
      delete_discount: boolean;
    };

    FAQ: {
      new_category: boolean;
      new_category_created: boolean;
      edit_category: boolean;
      edit_category_updated: boolean;
      delete_category: boolean;
      delete: boolean;
      new: boolean;
      select_category: boolean;
      no_changes: boolean;
      confirm_update: boolean;
    };

    USER: {
      receiver: boolean;
      result: boolean;
      preview: boolean;
      detail: boolean;
    };

    NOTICE: {
      delete: boolean;
    };

    WATCHCON: {
      mail: boolean;
      alert: boolean;
      success: boolean;
      disable: boolean;
      terms: boolean;
      legal: boolean;
      privacy: boolean;
      company: boolean;
    };

    ADDRESS: {
      tag: {
        new: boolean;
        edit: boolean;
        delete: boolean;
        alert: boolean;
      };
      address: {
        new: boolean;
        edit: boolean;
        delete: boolean;
        alert: boolean;
        confirm: boolean;
      };
      delete: {
        confirm: boolean;
      };
    };
  };

  toggleState: (key: string) => void;
}

export const useModalStore = create<ModalState>((set) => ({
  ModalStates: {
    MAIN: {
      notification: true,
      purchase_success: false,
      purchase_loading: false,
      purchase_error: false,
    },

    PRICING: {
      alert: false,
      new: false,
      edit: false,
      detail: false,
      new_discount: false,
      edit_discount: false,
      delete_discount: false,
    },

    FAQ: {
      new_category: false,
      new_category_created: false,
      edit_category: false,
      edit_category_updated: false,
      delete_category: false,
      delete: false,
      new: false,
      select_category: false,
      no_changes: false,
      confirm_update: false,
    },

    USER: {
      receiver: false,
      result: false,
      preview: false,
      detail: false,
    },

    NOTICE: {
      delete: false,
    },

    WATCHCON: {
      mail: false,
      alert: false,
      success: false,
      disable: false,
      terms: false,
      legal: false,
      privacy: false,
      company: false,
    },

    ADDRESS: {
      tag: {
        new: false,
        edit: false,
        delete: false,
        alert: false,
      },
      address: {
        new: false,
        edit: false,
        delete: false,
        alert: false,
        confirm: false,
      },
      delete: {
        confirm: false,
      },
    },
  },

  toggleState: (key: string) => {
    set((state) => {
      if (key.includes('MAIN')) {
        const modalKey = key.split('.')[1];
        return {
          ...state,
          ModalStates: {
            ...state.ModalStates,
            MAIN: {
              ...state.ModalStates.MAIN,
              [modalKey]: !state.ModalStates.MAIN[modalKey],
            },
          },
        };
      }

      if (key.includes('WATCHCON')) {
        const modalKey = key.split('.')[1];
        return {
          ...state,
          ModalStates: {
            ...state.ModalStates,
            WATCHCON: {
              ...state.ModalStates.WATCHCON,
              [modalKey]:
                !state.ModalStates.WATCHCON[modalKey],
            },
          },
        };
      }

      if (key.includes('PRICING')) {
        const modalKey = key.split('.')[1];
        return {
          ...state,
          ModalStates: {
            ...state.ModalStates,
            PRICING: {
              ...state.ModalStates.PRICING,
              [modalKey]:
                !state.ModalStates.PRICING[modalKey],
            },
          },
        };
      }

      if (key.includes('FAQ')) {
        const modalKey = key.split('.')[1];
        return {
          ...state,
          ModalStates: {
            ...state.ModalStates,
            FAQ: {
              ...state.ModalStates.FAQ,
              [modalKey]: !state.ModalStates.FAQ[modalKey],
            },
          },
        };
      }

      if (key.includes('NOTICE')) {
        const modalKey = key.split('.')[1];
        return {
          ...state,
          ModalStates: {
            ...state.ModalStates,
            NOTICE: {
              ...state.ModalStates.NOTICE,
              [modalKey]:
                !state.ModalStates.NOTICE[modalKey],
            },
          },
        };
      }

      if (key.includes('USER')) {
        const modalKey = key.split('.')[1];
        return {
          ...state,
          ModalStates: {
            ...state.ModalStates,
            USER: {
              ...state.ModalStates.USER,
              [modalKey]: !state.ModalStates.USER[modalKey],
            },
          },
        };
      }

      if (key.includes('ADDRESS')) {
        if (key.includes('tag')) {
          const [_, section, modalKey] = key.split('.');
          return {
            ...state,
            ModalStates: {
              ...state.ModalStates,
              ADDRESS: {
                ...state.ModalStates.ADDRESS,
                tag: {
                  ...state.ModalStates.ADDRESS.tag,
                  [modalKey]:
                    !state.ModalStates.ADDRESS.tag[
                      modalKey
                    ],
                },
              },
            },
          };
        } else if (key.includes('delete')) {
          const [_, section, modalKey] = key.split('.');
          return {
            ...state,
            ModalStates: {
              ...state.ModalStates,
              ADDRESS: {
                ...state.ModalStates.ADDRESS,
                delete: {
                  ...state.ModalStates.ADDRESS.delete,
                  [modalKey]:
                    !state.ModalStates.ADDRESS.delete[
                      modalKey
                    ],
                },
              },
            },
          };
        } else if (key.includes('address')) {
          const [_, section, modalKey] = key.split('.');
          return {
            ...state,
            ModalStates: {
              ...state.ModalStates,
              ADDRESS: {
                ...state.ModalStates.ADDRESS,
                address: {
                  ...state.ModalStates.ADDRESS.address,
                  [modalKey]:
                    !state.ModalStates.ADDRESS.address[
                      modalKey
                    ],
                },
              },
            },
          };
        } else if (key.includes('address_delete')) {
          const [_, section, modalKey] = key.split('.');
          return {
            ...state,
            ModalStates: {
              ...state.ModalStates,
              ADDRESS: {
                ...state.ModalStates.ADDRESS,
                address_delete: {
                  ...state.ModalStates.ADDRESS.address,
                  confirm:
                    !state.ModalStates.ADDRESS.address
                      .confirm,
                },
              },
            },
          };
        }
      }
    });
  },
}));
