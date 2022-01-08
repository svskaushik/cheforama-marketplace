
export default function ParallaxLanding() {
    if (typeof window !== "undefined") {
        document.addEventListener("mousemove", parallax);
        function parallax (e){
            document.querySelectorAll(".object").forEach(function(move){
            var moving_value = move.getAttribute("data-value");

            var x  = (e.clientX * moving_value) / 250;
            var y = (e.clientY * moving_value) / 250;

            move.style.transform = "translateX("+ x +"px) translateY(" + y + "px)";
            });
        }   
    }
        return(
            <div className="container relative flex items-center justify-center h-96 overflow-visible h-full w-full animate-loadtransition" id="parallax">
                <h2 className="object relative text-5xl text-center text-gray-700 font-semibold z-20 self-center animate-loadtransition" data-value="3">Oui Chef, WeChef<br/><span className="text-2xl">Giving your creations a life on the blockchain</span></h2>    
                <img src="logolayer.png" className="object-contain absolute h-full w-full animate-loadtransition animate-floatation mb-10" alt="" />
                <img src="plate1.png" className="object object-contain absolute h-full w-full animate-loadtransition" data-value="-2" alt="" />
                <img src="layersushi.png" className="object object-contain absolute h-full w-full animate-loadtransition" data-value="6" alt="" />
                <img src="layercroissant.png" className="object object-contain absolute h-full w-full animate-loadtransition" data-value="4" alt="" />
                <img src="layerdessert.png" className="object object-contain absolute h-full w-full animate-loadtransition" data-value="-6" alt="" />
                <img src="layersundae.png" className="object object-contain absolute h-full w-full animate-loadtransition" data-value="8" alt="" />
                <img src="layerblubeverage.png" className="object object-contain absolute h-full w-full animate-loadtransition" data-value="-4" alt="" />
                <img src="layerpasta7.png" className="object object-contain absolute h-full w-full animate-loadtransition" data-value="5" alt="" />
                <img src="layercoffee.png" className="object object-contain absolute h-full w-full animate-loadtransition" data-value="-9" alt="" />
                <img src="layerpizza.png" className="object object-contain absolute h-full w-full animate-loadtransition" data-value="5" alt="" />
            </div>
        )
    
}



