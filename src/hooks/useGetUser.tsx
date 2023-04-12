export const useGetUser = () => {
  const user = JSON.parse(localStorage.getItem('user') as string)

  return user
}
