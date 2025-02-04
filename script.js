document.addEventListener('DOMContentLoaded', function() {
    const menuItems = document.querySelectorAll('.nav-group a');
    
    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            // Remove a classe active de todos os itens
            menuItems.forEach(i => i.classList.remove('active'));
            // Adiciona a classe active apenas no item clicado
            this.classList.add('active');
        });
    });
}); 