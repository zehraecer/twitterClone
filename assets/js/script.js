const supabaseUrl = "https://gwmohqcgjtcoddbbhwlg.supabase.co"

const supabaseApiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd3bW9ocWNnanRjb2RkYmJod2xnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQ4OTkzNTIsImV4cCI6MjAzMDQ3NTM1Mn0.lweBCSYqY59P-xv3Cmk7OMqI5i9ijGy2I3lnLh-rNxE"

const _supabase = supabase.createClient(supabaseUrl, supabaseApiKey)

const commentForm = qs(".commenForm")
const newcomments = qs(".comments")
const loginform = qs(".loginForm")
const registerform = qs(".registerForm")


commentForm.addEventListener("submit", newComment)
registerform.addEventListener("submit", signup)

loginform.addEventListener("submit", loginForm)

async function getData() {

    const { data, error } = await _supabase
        .from('comments')
        .select()
    if (error) {
        return []
    }
    return data
}



async function getreplyData() {

    const { data, error } = await _supabase
        .from('reply')
        .select()
    if (error) {
        return []
    }
    return data
}


async function getNewComment() {
    newcomments.innerHTML = ""
    const comments = await getData()
    for (const comment of comments) {

        newcomments.innerHTML +=
            `
  
        <div class="comment" id="${comment.id}">

        <div class="comment-rating">
            <a href="#" class="comment-rating-up">
                +
            </a>
            <strong>${comment.comment_rating}</strong>
            <a href="#" class="comment-rating-down">
                -
            </a>

        </div>
        <div class="comment-body">
            <div class="comment-header">
                <div class="profile-info">
                    <img src="https://picsum.photos/id//40/40" alt="">
                    <strong>${comment.new_commenter}</strong>
                    <span>${comment.created_at}</span>
                </div>

                     <div class="btns">
                            <a class="delete-btn" href="#">
                                <img src="assets/img/Mask 2.svg" alt="">
                            </a>
                            <a class="reply-btn" href="#">
                                <img src="assets/img/Reply.svg" alt="">
                            </a>
                    </div>
                    
                    </div>
                     <p>${comment.new_comment}</p>
                
            </div>

            <form class="replyFormDiv">
                    <input type="text" name="replycomment" data-replyId="">
                    <button type="submit">submit</button>
             </form>

  `

    }
    const deletbtns = document.querySelectorAll(".delete-btn")
    const ratingup = document.querySelectorAll(".comment-rating-up")
    const ratingdown = document.querySelectorAll(".comment-rating-down")
    const replyBtns = document.querySelectorAll(".reply-btn")

    for (const replyBtn of replyBtns) {
        replyBtn.addEventListener("click", replyComment)
    }


    for (const down of ratingdown) {
        down.addEventListener("click", ratingDown)
    }

    for (const up of ratingup) {
        up.addEventListener("click", ratingUp)
    }

    for (const deletbtn of deletbtns) {
        deletbtn.addEventListener("click", deleteComment)

    }

}



async function replyComment(e) {
    e.preventDefault()
    const repylForms = document.querySelectorAll(".replyFormDiv")
    const repylFormdiv = document.querySelectorAll(".replyFormDiv")

    const commentElement = e.target.closest('.comment');
    if (!commentElement) return; //
    // Yorum elementi içindeki yanıt formunu bulun
    const replyForm = commentElement.querySelector('.replyFormDiv');

    replyForm.style.display = "block";

    // const replyInput = replyForm.querySelector('input[name="replycomment"]');
    // replyInput.focus();


    for (const repylForm of repylForms) {
        repylForm.addEventListener("submit", async (e) => {
            e.preventDefault()
            console.log("oldu");
            const user = await getreplyData()
            console.log(user);

            const isauth = await isAuth()

            console.log(isauth);
            const formData = new FormData(e.target)
            const formObj = Object.fromEntries(formData)
            console.log(formObj);


            const { data, error } = await _supabase
                .from('reply')
                .insert([
                    {
                        comment_reply: formObj.replycomment,
                        reply_commenter: isauth.email

                    }
                ])
                .select()

            console.log(data);
            console.log(error);


        })
    }

}





async function ratingDown(e) {
    e.preventDefault()

    const rating = await getData()

    const y = rating.find(user => user.id == this.parentElement.parentElement.id)
    let x = Number(y.comment_rating)


    if (x > 0) {

        x--
    }

    const { data, error } = await _supabase
        .from('comments')
        .update({ comment_rating: x })
        .eq('id', this.parentElement.parentElement.id)

    getNewComment()


}


async function ratingUp(e) {
    e.preventDefault()


    const rating = await getData()

    const y = rating.find(user => user.id == this.parentElement.parentElement.id)
    let x = Number(y.comment_rating)

    x++

    const { data, error } = await _supabase
        .from('comments')
        .update({ comment_rating: x })
        .eq('id', this.parentElement.parentElement.id)

    getNewComment()


}

async function deleteComment(e) {
    e.preventDefault()

    const { error } = await _supabase
        .from('comments')
        .delete()
        .eq('id', this.parentElement.parentElement.parentElement.parentElement.id)

    getNewComment()

}



async function newComment(e) {
    e.preventDefault()

    const formdata = new FormData(e.target)
    const formObj = Object.fromEntries(formdata)
    const isauth = await isAuth()
    console.log(isauth);
    console.log(formObj);


    const { data, error } = await _supabase
        .from('comments')
        .insert([{

            new_commenter: isauth.email,
            new_comment: formObj.new_comment
        }
        ])
        .select()

    e.target.reset()
    getNewComment()
    console.log(data);
}


async function signup(e) {
    e.preventDefault()

    const formdata = Object.fromEntries(new FormData(e.target))

    console.log(formdata.registerEmail);
    console.log(formdata.registerPassword);


    const { data, error } = await _supabase.auth.signUp({
        email: formdata.registerEmail,
        password: formdata.registerPassword,
    })
    console.log(data);

}

async function loginForm(e) {
    e.preventDefault()

    const formdata = Object.fromEntries(new FormData(e.target))
    // console.log(formdata.loginEmail);
    // console.log(formdata.loginPassword);


    const { data, error } = await _supabase.auth.signInWithPassword({
        email: formdata.loginEmail,
        password: formdata.loginPassword,
    })
    if (!error) {
        window.location.href = "index.html"
    } else {
        window.location.href = "login.html"
    }
    console.log(data);

}


async function isAuth() {

    const { data, error } = await _supabase.auth.getSession()
    if (!error && data.session !== null) {
        window.location.href = "index.html"
        return data.session.user;
    } else {
        window.location.href = "login.html"
    }

    console.log(data);


}

getNewComment() 