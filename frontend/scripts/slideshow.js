let currentSlide = 0;

    function showSlide(nextIndex, direction = 1) {
        const slides = document.querySelectorAll('.slide');
        const dots = document.querySelectorAll('.dot');

        if (nextIndex === currentSlide) return;

        const current = slides[currentSlide];
        const next = slides[nextIndex];

        const movement_dir = direction === 1 ? 'to-left' : 'to-right';
        const movement_source = direction === -1 ? 'to-left' : 'to-right';

        // Remove classes
        slides.forEach(s => s.classList.remove('active', 'to-left', 'to-right'));
        dots.forEach(d => d.classList.remove('active'));

        // Slide out current
        current.classList.add(movement_dir);
        current.classList.add('slow-transition');
        current.classList.remove('active');

        // Prepare next slide position
        next.classList.add(movement_source);
        // Force reflow
        void next.offsetWidth;
        // Then animate from source to central fading in
        next.classList.add('slow-transition');
        next.classList.remove(movement_source);
        next.classList.add("active");

        void next.offsetWidth;
        void current.offsetWidth;
        current.classList.remove('slow-transition');
        next.classList.remove('slow-transition');

        dots[nextIndex].classList.add('active');
        currentSlide = nextIndex;
    }

    function ArrowToSlide(direction) {
        const slides = document.querySelectorAll('.slide');
        let nextIndex = (currentSlide + direction+slides.length) % slides.length;
        showSlide(nextIndex, direction);
    }

    function DotToSlide(index) {
        let direction = index > currentSlide ? 1 : -1;
        showSlide(index, direction);
    }