import { useEffect } from "react";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { userUpdateDocument } from "../../hooks/userUpdateDocument";
import { useAuthValue } from "../../context/AuthContext";
import styles from "./EditPost.module.css";
import { userFetchDocument } from "../../hooks/userFetchDocument";


const EditPost = () => {
    const { id } = useParams();
    const { document: post } = userFetchDocument("posts", id)

    const [title, setTitle] = useState("")
    const [image, setImage] = useState("")
    const [body, setBody] = useState("")
    const [tags, setTags] = useState([])
    const [formError, setFormError] = useState(null)

    useEffect(() => {
        if (post) {
            setTitle(post.title)
            setImage(post.image)
            setBody(post.body)
            setTags(post.tags)

            const textTags = post.tags.join(", ")

            setTags(textTags)
        }
    }, [post])

    const { user } = useAuthValue()

    const navigate = useNavigate()

    const { updateDocument, response } = userUpdateDocument("posts")

    const handleSubmit = async (e) => {
        e.preventDefault()
        setFormError("")
        const tagsArray = tags.split(",").map(tag => tag.trim())

        const data = {
            title,
            image,
            body,
            tags: tagsArray,
        }

        updateDocument(id, data)

        navigate("/dashboard")
    }
    return (
        <div className={styles.edit_post}>
            {post && (
                <>
                    <h2>Editando post {post.title}</h2>
                    <p>Altere os dados do post como desejar</p>
                    <form onSubmit={handleSubmit} action="">
                        <label>
                            <span>Titulo:</span>
                            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
                        </label>
                        <label>
                            <span>Imagem:</span>
                            <input type="text" value={image} onChange={(e) => setImage(e.target.value)} required />
                        </label>
                        <p styles={styles.preview_title}>Preview da iamgem Atual</p>
                        <img src={post.image} alt="" styles={styles.image_preview} />
                        <label>
                            <span>Conteúdo:</span>
                            <textarea value={body} onChange={(e) => setBody(e.target.value)} required />
                        </label>
                        <label>
                            <span>Tags:</span>
                            <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} required />
                        </label>
                        {!response.loading && <button className="btn" type="submit">EDitar</button>}
                        {response.loading &&(
                            <button type="submit" disabled>Carregando...</button>
                        )}
                        {(response.error || formError) && (
                            <p className={styles.error}>{response.error || formError}</p>
                        )}
                    </form>
                </>
            )}
        </div>
    )
}

export default EditPost