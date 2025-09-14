# import das bibliotecas
from fastapi import FastAPI, UploadFile, File, Form
from langchain_groq import ChatGroq
from langchain.prompts import ChatPromptTemplate
from langchain_community.document_loaders import WebBaseLoader, PyPDFLoader
import tempfile

app = FastAPI()

# Configuração do modelo
api_key = "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"
chat = ChatGroq(model="llama-3.3-70b-versatile", api_key=api_key)

template = ChatPromptTemplate.from_messages([
    ("system", "Você é um assistente educado e útil. Use o contexto abaixo se existir: {contexto}"),
    ("user", "{input}")
])
chain = template | chat


# ChatBot 
@app.post("/chat")
def chat_tradicional(question: str):
    resposta = chain.invoke({"contexto": "", "input": question})
    return {"resposta": resposta.content}


# ChatBot com URL 
@app.post("/chat/url")
def chat_com_url(url: str, question: str):
    loader = WebBaseLoader(url)
    docs = loader.load()
    contexto = " ".join([d.page_content for d in docs])
    resposta = chain.invoke({"contexto": contexto, "input": question})
    return {"resposta": resposta.content}


# ChatBot com Arquivo PDF 
@app.post("/chat/file")
async def chat_com_arquivo(file: UploadFile = File(...), question: str = Form(...)):
    # salvar arquivo temporário
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
        tmp.write(await file.read())
        tmp_path = tmp.name

    loader = PyPDFLoader(tmp_path)
    docs = loader.load()
    contexto = " ".join([d.page_content for d in docs])
    resposta = chain.invoke({"contexto": contexto, "input": question})
    return {"resposta": resposta.content}