AFRAME.registerComponent("balls",{

    init:function(){
        this.throwBall()
    },

    throwBall:function(){
        window.addEventListener("keydown",(e)=>{
            if(e.key === "t"){
                var ball =document.createElement("a-entity");
                ball.setAttribute("gltf-model","./models/bowlingBall/scene.gltf");
                ball.setAttribute("scale",{x:3, y:3,z:3});
                
                var cam=document.querySelector("#camera");
                pos=cam.getAttribute("position");
                ball.setAttribute("position",{
                    x:pos.x,
                    y:pos.y,
                    z:pos.z
                })
                ball.setAttribute("dynamic-body",{
                    shape:"sphere",
                    mass:0
                })

                var camera= document.querySelector("#camera").object3D;
                var direction= new THREE.Vector3();
                camera.getWorldDirection(direction);

                ball.setAttribute("velocity",direction.multiplyScalar(-10))
                var scene= document.querySelector("#scene")
                ball.addEventListener("collide", this.removeBall)
                scene.appendChild(ball)
            }
        })
    },

    removeBall:function(e){
        console.log(e.detail.target.el);
        var element = e.detail.target.el
        console.log(e.detail.body.el);
        var elementHit = e.detail.body.el

        if(elementHit.id.includes("pin")){
            elementHit.setAttribute("material",{
                opacity:1,
                transparent:true
            })
            var impulse = new CANNON.Vec3(-2,2,1)

            var worldPoint=new CANNON.Vec3().copy(
                elementHit.getAttribute("position")
            )
            element.body.applyImpulse(impulse,worldPoint)
        }

        //Removing the event listener
        element.removeEventListener("collide",this.throwBall)
        
        //Remove the ball from the scene
        var scene = document.querySelector("#scene")
        scene.removeChild(element)
    }
})