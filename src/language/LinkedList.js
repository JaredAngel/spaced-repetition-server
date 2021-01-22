class _Node {
  constructor(value, next) {
    this.value = value,
    this.next = next;
  }
}

class LinkedList {
  constructor(){
    this.head = null;
  }

  populateList(words, head){
    this.insertLast(words[(head - 1) % words.length]);

    let current = this.head;
    for(let i = 1; i<words.length; i++){
      this.insertLast(words[(current.value.next - 1) % words.length]);
      current = current.next;
    }
  }

  insertFirst(item) {
    this.head = new _Node(item, this.head);
  }

  insertLast(item) {
    if (this.head === null) {
        this.insertFirst(item);
    }
    else {
        let tempNode = this.head;
        while (tempNode.next !== null) {
            tempNode = tempNode.next;
        }
        tempNode.next = new _Node(item, null);
    }
  }

  moveHead(pos){
    let current = this.head;

    while(pos > 0 && current.next){
      current = current.next;
      pos--;
    }

    this.head.value.next = current.next ? current.next.value.id : null;
    current.value.next = this.head.value.id;
    current.next = new _Node(this.head.value, current.next);
    this.head = this.head.next;
    return {
      old_head: current.next.value,
      updated_node: current.value,
      new_head_id: this.head.value.id 
    };
  }

  printList(){
    let current = this.head;
    while(current.next){
      console.log(current.value);
      current = current.next;
    }
    console.log('This is my shifted link list');
  }
}

module.exports = LinkedList;