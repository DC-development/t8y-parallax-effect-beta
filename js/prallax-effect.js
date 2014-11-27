/**
 * Parallax-effect beta
 * 
 * Tryin to copy the parallax effect from this page:
 * // http://emosite.volkswagen.de/jetta/?culture=de_DE
 * 
 * @Author: Philipp Sengelmann <sengelmann.philipp@googlemail.com>
 *     
 */

$(document).ready(function() {

    var $window = $(window);

    //Vars for calculating focussed objects position    
    var imgHeight = 540;
    var inertia = 4; //Alter this value to adjust the slow-down effect
    var parkHeight = imgHeight / inertia;
    var parkStep = parkHeight / imgHeight;

    $.fn.scrollEnd = function(callback, timeout) {
        $(this).scroll(function(){
            var $this = $(this);
            if ($this.data('scrollTimeout')) {
                clearTimeout($this.data('scrollTimeout'));
            }
            $this.data('scrollTimeout', setTimeout(callback,timeout));
        });
    };

    $(window).scrollEnd(function(){

        var parallaxContent = $(".parallax-content.in-focus");
        var parentContainer = $(".parallax-content.in-focus").parent();

        var yPosAbsolute = Math.floor(parentContainer.offset().top);
        var yPosNextSibling = Math.floor(parentContainer.next().offset().top - $window.scrollTop());
        var yPosNextSiblingAbsolute = Math.floor(parentContainer.next().offset().top);

        if(yPosNextSibling < 200){
            //window.scrollTo(0,yPosNextSiblingAbsolute);
            var body = $("html, body");
            body.animate({scrollTop:yPosNextSiblingAbsolute}, '500', 'swing', function() {
                // alert("Finished animating"); 
                var block = false;
            });
        }else{
            var body = $("html, body");
            body.animate({scrollTop:yPosAbsolute}, '500', 'swing', function() {
                // alert("Finished animating");
                var block = false;
            });
        }
    }, 500);

    $window.scroll(function() {

        /**
         * Get all parallax containers within the function
         * @Todo: Would be better to fetch it on init once but the way the script doesnt fire in response on backbone-route
         */
        var parallaxContainers = $(".parallax-content");

        //This is called for every scrollstep 
        $.each(parallaxContainers, function( index, value ) {

            //fetch the current container from the array and wrap it as a jQuery-Object
            var container = $(parallaxContainers[index]);
            //To use it like this to get its parent offset cause we test for <0 and set the child 
            //to top:0 while the parent container is beeing scrolled on, so we have access to the original position.
            var yPos = Math.floor(container.parent().offset().top - $window.scrollTop());
            //
            if(yPos<=0&&yPos>-imgHeight){
                container.addClass("in-focus");
                var ps = Math.floor(container.parent().next().offset().top - $window.scrollTop());
                var d = (imgHeight - ps) * parkStep;
                container.css('top', -d);
                container.css('opacity', ((1/imgHeight)*ps));
                //console.log(imgHeight +"-"+ ps +"*"+parkStep+"="+ d); 
            }else if(container.css("position")=="fixed"){
                container.removeClass("in-focus");
                container.css('top', '');   
            }else{
                var ps = Math.floor(container.parent().next().offset().top - $window.scrollTop());
                container.css('opacity', ((1*imgHeight)/ps));   
            }
            
           //container.find(".pos").text((1*imgHeight)/ps); 
            //console.log(p , id); 
        });
    });

});