import java.util.ArrayList;
import java.util.List;

class Node {
    char data;
    List<Node> children;

    public Node(char data) {
        this.data = data;
        this.children = new ArrayList<>();
    }
}

public class GenericTreeFinder {
    
    public static void findGenericNodes(Node node, List<Character> results) {
        if (node == null) return;

        if (node.children.size() > 2) {
            results.add(node.data);
        }

        for (Node child : node.children) {
            findGenericNodes(child, results);
        }
    }

    public static void main(String[] args) {
        Node root = new Node('A');
        Node nodeB = new Node('B'); 
        Node nodeC = new Node('C');
        
        root.children.add(nodeB);
        root.children.add(nodeC);

        nodeB.children.add(new Node('D'));
        nodeB.children.add(new Node('E'));
        nodeB.children.add(new Node('F'));

        nodeC.children.add(new Node('G'));
        nodeC.children.add(new Node('H'));

        List<Character> genericNodes = new ArrayList<>();
        findGenericNodes(root, genericNodes);

        System.out.println("Nodes identified as generic (more than 2 children): " + genericNodes);
    }
}