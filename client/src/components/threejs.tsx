import { useEffect, useState } from "react"

export default function Threejs() {
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        const threejs = document.createElement("script")
        threejs.src =
            "https://cdnjs.cloudflare.com/ajax/libs/three.js/r125/three.min.js"

        let vertexshader: HTMLScriptElement | null = null
        let fragmentshader: HTMLScriptElement | null = null
        let script: HTMLScriptElement | null = null
        let script2: HTMLScriptElement | null = null

        threejs.onload = () => {
            vertexshader = document.createElement("script")
            vertexshader.type = "x-shader/x-vertex"
            vertexshader.id = "vertexshader"
            vertexshader.innerHTML = `
                attribute float size;
                attribute vec3 customColor;
                varying vec3 vColor;

                void main() {
                    vColor = customColor;
                    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
                    gl_PointSize = size * ( 300.0 / -mvPosition.z );
                    gl_Position = projectionMatrix * mvPosition;
                }
            `
            document.body.appendChild(vertexshader)

            fragmentshader = document.createElement("script")
            fragmentshader.type = "x-shader/x-fragment"
            fragmentshader.id = "fragmentshader"
            fragmentshader.innerHTML = `
                uniform vec3 color;
                uniform sampler2D pointTexture;
                varying vec3 vColor;

                void main() {
                    gl_FragColor = vec4( color * vColor, 1.0 );
                    gl_FragColor = gl_FragColor * texture2D( pointTexture, gl_PointCoord );
                }
            `
            document.body.appendChild(fragmentshader)

            script = document.createElement("script")
            script.src = "/scripts/threejs-scripts.js"
            document.body.appendChild(script)

            script2 = document.createElement("script")
            script2.type = "text/javascript"
            script2.text = `
                document.addEventListener("DOMContentLoaded", () => {
                    preload();
                });
            `
            document.body.appendChild(script2)

            setIsLoaded(true)
        }
        document.body.appendChild(threejs)

        return () => {
            document.body.removeChild(threejs)
            if (vertexshader) document.body.removeChild(vertexshader)
            if (fragmentshader) document.body.removeChild(fragmentshader)
            if (script) document.body.removeChild(script)
            if (script2) document.body.removeChild(script2)
        }
    }, [])

    return <>{isLoaded && <div id="magic" className="h-full w-full"></div>}</>
}
