const loginForm = document.querySelector('.login-form')

loginForm.addEventListener('submit',async()=>{
    const { token } = await axios.post('/login')
    localStorage.setItem('token',token.token)

    try {
        await axios.get('/dashboard', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
    }catch(err){
        console.log(err)
    }
})





