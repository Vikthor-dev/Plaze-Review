import axios from 'axios'

let Service = axios.create({
    baseURL: 'http://localhost:3000',
    timeout:1000
})

let Posts = {
/*    async getComments(id){
    let response = await Service.get(`/comments/${id}`)
    let data = response.data
    console.log("Komentari sa bakenda: ",data)
    return data                                  
   }, */
   async new_comment(data){
       console.log("Komentar: ",data)
       await Service.post('/comments',data)
   },
   async update_post(data,id){
       console.log("Spremam na backend: ",data);
       let serverData={
        title:data.title,
        url:data.url,
        postedBy:data.postedBy,
        score:data.score,
        description:data.description,
        beach_type:data.beach_type,
        lf_tower:data.lf_tower,
        pets_allowed_answer:data.pets_allowed_answer,
        free_beach:data.free_beach,
        posted_at:data.posted_at
       }
       await Service.patch(`/posts/${id}`,serverData)
       return

   },
   async new_post(data){

    console.log("Spremam na backend:",data)

     let serverData={
         title:data.title,
         url:data.url,
         postedBy:data.postedBy,
         score:data.score,
         description:data.description,
         beach_type:data.beach_type,
         lf_tower:data.lf_tower,
         pets_allowed_answer:data.pets_allowed_answer,
         free_beach:data.free_beach,
         posted_at:data.posted_at,
         postedBy_id:data.postedBy_id
    }
    await Service.post('/posts',serverData)
    return
  },
  async getOne(id){
      let response = await Service.get(`/posts/${id}`)
      let doc = response.data
      return{
        id:doc._id,
        title:doc.title,
        url:doc.url,
        postedBy:doc.postedBy,
        score:parseInt(doc.score),
        description:doc.description,
        beach_type:doc.beach_type,
        lf_tower:doc.lf_tower,
        pets_allowed_answer:doc.pets_allowed_answer,
        free_beach:doc.free_beach,
        posted_at:doc.posted_at,
        postedBy_id:doc.postedBy_id    
      }
  }, 
  async getAll(searchTerm){
        let response = await Service.get(`/posts?_any=${searchTerm}`)
        let data = response.data                                      
        data = data.map(doc => {                                      
            return{
                id:doc._id,
                title:doc.title,
                url:doc.url,
                postedBy:doc.postedBy,
                score:parseInt(doc.score),
                description:doc.description,
                beach_type:doc.beach_type,
                lf_tower:doc.lf_tower,
                pets_allowed_answer:doc.pets_allowed_answer,
                free_beach:doc.free_beach,
                posted_at:doc.posted_at    
              }
          })
          console.log("Podaci sa backenda: ",data)
          return data
    }
}

export {Service,Posts}