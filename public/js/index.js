/* eslint-env browser */

import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'
import { CodeMirrorBinding } from 'y-codemirror'
import CodeMirror from 'codemirror'
import 'codemirror/mode/clike/clike.js'


let room = document.getElementById("roomname").value
window.addEventListener('load', () => {
  const ydoc = new Y.Doc()
  const provider = new WebsocketProvider(
    `${location.protocol === 'http:' ? 'ws:' : 'wss:'}${location.host}`,
    room,
    ydoc
  )
  const yText = ydoc.getText('codemirror')
  const editorContainer = document.createElement('div')
  editorContainer.setAttribute('id', 'editor')
  document.body.insertBefore(editorContainer, null)
  let content = document.getElementById("content").value
  console.log("This is content: "+ content)
  const editor = CodeMirror(editorContainer, {
    mode: 'text/x-java',
    lineNumbers: true
  })

/*
  editor.setValue(content)
  setTimeout(function() {
    editor.refresh();
  },10);
*/
  

  const binding = new CodeMirrorBinding(yText, editor, provider.awareness)
  editor.setValue(content)
  document.getElementById("form").onsubmit = function(evt){
	console.log("HELLO ME");
	document.getElementById("editortext").value = editor.getValue();
	console.log("TEXTAREA has the following: "+document.getElementById("editortext").value);
  }

  const connectBtn = document.getElementById('y-connect-btn')
  connectBtn.addEventListener('click', () => {
    if (provider.shouldConnect) {
      provider.disconnect()
      connectBtn.textContent = 'Connect'
    } else {
      provider.connect()
      connectBtn.textContent = 'Disconnect'
    }
  })

  window.example = { provider, ydoc, yText, binding }
})
