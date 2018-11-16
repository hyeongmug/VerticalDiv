function VerticalDiv(options) { // 재사용 모듈화를 위해서는 function으로 묶어주어야함

    // 이름은 VerticalDiv라고 지었음 ㅋㅋㅋ


    var o = $.extend({
        // el : window,
        duration: 300,
        blockClassName: '.block',
        btn: '.btn'
    }, options || {});



    var self = $.extend(this, o);



    var move_state = false; // 스크롤 이동 유효한지 검증하기 위한 변수
    // var el = $(self.el);
    var block = $(self.blockClassName);
    var blockLength = block.length; // .block 갯수이삼
    var current = 0; // 현재 'active' 상태인 .block의 익덱스 번호
    var btn = $(self.btn);
    var win = $(window); // 윈도우가 스크롤 되므로 엘리먼트는 윈도우로 지정.
    var current = 0; // 현재 .block의 익덱스 번호
    var duration = self.duration;
    var doc = $('html, body');

    // Block사이즈 정보를 담은 배열을 반환하는 메소드
    self.getArrayblockSize = function() {

        var blockSizeArray = []; // block 사이즈를 담을 배열을 만들었삼

        for (var i = 0; i < blockLength; i++) {

            var blockTop = $(block[i]).offset().top; // 엘리먼트의 top위치값을 구했삼 
            var blockHeight = $(block[i]).outerHeight(true); // 마진,패딩까지 포함하는 엘리먼트의 높이를 구했삼.

            blockSizeArray.push([blockTop, blockHeight]) // 배열에 넣었삼

        }

        //console.log(blockSizeArray); // 만든 배열은 이렇게 생겼삼 콘솔로그에서 확인하삼

        return blockSizeArray;

    }


    // 이동해야하는 블록이 Index를 구하는 메소드
    self.getMoveIndex = function(index) {
        var moveIndex;

        if (index > blockLength - 1) {
            moveIndex = blockLength - 1;
        } else if (index < 0) {
            moveIndex = 0;
        } else {
            moveIndex = index;
        }


        return moveIndex;
    }

    // 스크롤 이동 유효한지 판단하여 getMoveIndex, moveAni을 실행하는 메소드
    self.move = function(dir) {

        if (move_state == false) {

            move_state = true;

            current = self.getMoveIndex(current + dir);

            self.moveAni(current);

        }
    }


    // 현재의 활성화된 요소들에 .active를 부여하는 메소드
    self.activeBlockAndBtn = function(index) {
        btn.removeClass('active');
        btn.eq(index).addClass('active');
        block.removeClass('active');
        block.eq(index).addClass('active');
    }


    // 애니메이션을 실행시키는 메소드
    self.moveAni = function(index) {

        // 스크롤 해야하는 길이를 구함
        var scrollHeight = $('.block').eq(index).offset().top;


        // 애니메이션 시작
        doc.stop().animate({
            scrollTop: Number(String(scrollHeight).replace('px', ''))
        }, duration, function() {
            // 애니메이션이 종료되면

            move_state = false; // 스크롤 이동 안하고 있음 으로 바꾸어주고

            self.activeBlockAndBtn(index); // 해당하느 요소에 '.active' 추가 !
        });

    }


    // 마우스 힐 이벤트
    win.on("mousewheel DOMMouseScroll", function(e) {

        // 윈도우가 마우스휠 이벤트가 발생하면 실행

        var event = e.originalEvent; // 순수 자바스크립트의 이벤트 변수가 필요한데 Jquery기 때문에 순수 javascript의 Event를 가져온거임
        var delta = 0; // 방향 초기값을 0으로 해두었음

        e.preventDefault(); // 이벤트 발생하면 원래의 기능을 끔

        // detail은 파이어폭스, wheelDelta은 익스,크롬
        delta = event.detail ? event.detail * -40 : event.wheelDelta;

        // -40 곱하기 한건 파이어폭스가 detail값이 40만큼 익스하고 다르기 때문임.

        if (delta < 0) {

            self.move(1); // 정방향이면 1 이고

        } else if (delta > 0) {

            self.move(-1); // 역방향이면 -1

        }
    });


    // 스크롤 이벤트
    win.on('scroll', function(e) {

        var blockSizeArray = self.getArrayblockSize(); // 각 .block의 사이즈를 구해옴
        var scrollTop = win.scrollTop(); // 위도우가 얼마나 스크롤 하고 있는지도 구하고.

        for (var i = 0; i < blockSizeArray.length; i++) {

            var blockTop = blockSizeArray[i][0]; // .block의 top 위치값 
            var blockHeight = blockSizeArray[i][1]; // .block의 height;
            var scrolltopHeight = (blockTop + blockHeight); // .block 바닥면의 위치값을 구함

            if (scrollTop < scrolltopHeight && scrollTop >= blockTop) {
                // 현재 block 범위에 있는지 조건문 판단 한건데,
                // 이건 글로 설명하기 애매하고 그림으로 설명해야 이해가 잘됨... 

                current = i;
                self.activeBlockAndBtn(current);
            }

        }

    });
}