import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../store'
import { toggleTheme, setTheme } from '../store/reducers/uiSlice'

export const useTheme = () => {
  const theme = useSelector((state: RootState) => state.ui.theme)
  const dispatch = useDispatch()

  const toggle = () => {
    dispatch(toggleTheme())
  }

  const setLight = () => {
    dispatch(setTheme('light'))
  }

  const setDark = () => {
    dispatch(setTheme('dark'))
  }

  const isDark = theme.mode === 'dark'
  const isLight = theme.mode === 'light'

  return {
    theme,
    toggle,
    setLight,
    setDark,
    isDark,
    isLight
  }
}
