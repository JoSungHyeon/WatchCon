import { useReducer } from 'react';

interface PageSearchState {
  pageSize: number;
  currentPage: number;
  searchInput: string;
  searchTerm: string;
  startDate: Date;
  endDate: Date;
  tempStartDate: Date;
}

type PageSearchAction =
  | { type: 'SET_PAGE_SIZE'; payload: number }
  | { type: 'SET_CURRENT_PAGE'; payload: number }
  | { type: 'SET_SEARCH_INPUT'; payload: string }
  | { type: 'SET_SEARCH_TERM'; payload: string }
  | { type: 'SET_TEMP_START_DATE'; payload: Date }
  | { type: 'APPLY_DATE_FILTER' };

const initialState: PageSearchState = {
  pageSize: 10,
  currentPage: 1,
  searchInput: '',
  searchTerm: '',
  startDate: new Date(
    new Date().setMonth(new Date().getMonth() - 2),
  ),
  endDate: new Date(),
  tempStartDate: new Date(
    new Date().setMonth(new Date().getMonth() - 2),
  ),
};

function pageSearchReducer(
  state: PageSearchState,
  action: PageSearchAction,
): PageSearchState {
  switch (action.type) {
    case 'SET_PAGE_SIZE':
      return {
        ...state,
        pageSize: action.payload,
        currentPage: 1,
      };
    case 'SET_CURRENT_PAGE':
      return {
        ...state,
        currentPage: action.payload,
      };
    case 'SET_SEARCH_INPUT':
      return {
        ...state,
        searchInput: action.payload,
      };
    case 'SET_SEARCH_TERM':
      return {
        ...state,
        searchTerm: action.payload,
        currentPage: 1,
      };
    case 'SET_TEMP_START_DATE':
      return {
        ...state,
        tempStartDate: action.payload,
      };
    case 'APPLY_DATE_FILTER':
      return {
        ...state,
        startDate: state.tempStartDate,
        currentPage: 1,
      };
    default:
      return state;
  }
}

export function usePageSearchReducer(
  customInitialState?: Partial<PageSearchState>,
) {
  const [state, dispatch] = useReducer(pageSearchReducer, {
    ...initialState,
    ...customInitialState,
  });

  const actions = {
    setPageSize: (size: number) =>
      dispatch({ type: 'SET_PAGE_SIZE', payload: size }),
    setCurrentPage: (page: number) =>
      dispatch({ type: 'SET_CURRENT_PAGE', payload: page }),
    setSearchInput: (input: string) =>
      dispatch({
        type: 'SET_SEARCH_INPUT',
        payload: input,
      }),
    setSearchTerm: (term: string) =>
      dispatch({ type: 'SET_SEARCH_TERM', payload: term }),
    setTempStartDate: (date: Date) =>
      dispatch({
        type: 'SET_TEMP_START_DATE',
        payload: date,
      }),
    applyDateFilter: () =>
      dispatch({ type: 'APPLY_DATE_FILTER' }),
  };

  return { state, actions };
}
