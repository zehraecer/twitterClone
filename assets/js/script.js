const supabaseUrl = "https://gwmohqcgjtcoddbbhwlg.supabase.co"

const supabaseApiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd3bW9ocWNnanRjb2RkYmJod2xnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQ4OTkzNTIsImV4cCI6MjAzMDQ3NTM1Mn0.lweBCSYqY59P-xv3Cmk7OMqI5i9ijGy2I3lnLh-rNxE"

const _supabase = supabase.createClient(supabaseUrl, supabaseApiKey)

const commentForm = document.querySelector(".commenForm")
const newcomments = document.querySelector(".comments")

commentForm.addEventListener("submit", newComment)

async function getData() {

    const { data, error } = await _supabase
        .from('comments')
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

                <div>
                    <a class="delete-btn" href="#">
                    <img src="assets/img/Mask 2.svg" alt="">
                    </a>
                </div>

            </div>
            <p>${comment.new_comment}</p>
        </div>

        </div>
  `

    }
    const deletbtns = document.querySelectorAll(".delete-btn")
    const ratingup = document.querySelectorAll(".comment-rating-up")
    const ratingdown = document.querySelectorAll(".comment-rating-down")

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
    console.log(formObj);


    const { data, error } = await _supabase
        .from('comments')
        .insert([{

            new_commenter: formObj.new_commenter,
            new_comment: formObj.new_comment
        }
        ])
        .select()

    e.target.reset()
    getNewComment()
    console.log(data);
}

getNewComment() 