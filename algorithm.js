var AMOUNT = 10;                                                                // How many elements?
var LIMIT = 15;                                                                 // All elements have non-negative integer values below LIMIT

/**
 * For creation of collection without duplicates,
 * refer to 'create_indices()' on main page
 */
function create_random_array (amount, limit) {
    var a = [];
    for ( var i = 0; i < amount; i++ )
        a.push( Math.floor(Math.random() * limit) );
    return a;
}
/**
 * Value is wrapped by an object with two properties:
 *      - the value
 *      - a pointer to another object; initially NULL
 */
function create_container (value) {
    var tmp = {};
    tmp.value = value;
    tmp.next = null;
    return tmp;
}
/**
 * Return value is last element;
 * start element must be remembered elsewhere
 * 
 * @returns Object
 */
function array_to_list (start, values) {
    var tmp = start;
    var next;
    for ( var i = 1; i < values.length; i++ ) {
        next = create_container(values[i]);
        tmp.next = next;
        tmp = next;
    }
    return tmp;
}
/**
 * Creates new Array and fills it with values from list
 */
function list_to_array (first) {
    var a = [ first.value ];
    var tmp = first.next;
    while ( tmp ) {
        a.push(tmp.value);
        tmp = tmp.next;
    }
    return a;
}
/**
 * Takes two well-sorted lists; returns one well-sorted list
 * 
 * Technique is probably inspired by (or at least similar to) a zipper
 */
function merge (first, second) {
    var to_return, alternative, tmp_alternative;
    /**
     * Since both lists are sorted, the overall return value
     * must be the lower of first and second
     */
    if ( first.value <= second.value ) {
        to_return = first;
        alternative = second;
    }
    else {
        to_return = second;
        alternative = first;
    }
    /**
     * Pointer to first element; will move in the following
     */
    var tmp = to_return;
    /**
     * No more alternative element (one of the lists is empty):
     * Stop. Remaining elements are connected and sorted 
     */
    while ( alternative ) {
        /**
         * Is there a next element, and is it better than 'alternative'?
         * Then move right...
         */
        while ( tmp.next && tmp.next.value <= alternative.value )
            tmp = tmp.next;
        /**
         * ...otherwise, swap 'tmp' and 'alternative'
         */
        tmp_alternative = tmp.next;
        tmp.next = alternative;
        tmp = alternative;
        alternative = tmp_alternative;
    }
    /**
     * List is necessarily sorted now
     */
    return to_return;
}
function natural_merge_sort (first, last) {
    /**
     * First partial list:
     * All already sorted elements, beginning with the first
     * in the worst case only one (then it's identical to traditional merge sort)
     */
    var first_end = first;
    while ( first_end.next && first_end.value <= first_end.next.value )
        first_end = first_end.next;
    /**
     * If the list's end is reached: return it
     */
    if ( !first_end.next )
        return first;
    
    /**
     * Second partial list:
     * All already sorted elements,
     * beginning with the element behind first_end
     */
    var second_start = first_end.next;
    var second_end = second_start;
    while ( second_end.next && second_end.value <= second_end.next.value )
        second_end = second_end.next;
    
    /**
     * Partial lists shall not be connected
     */
    first_end.next = null;
    
    /**
     * Remaining elements; probably unsorted...
     */
    var remaining = second_end.next;
    /**
     * ...and disconnected from the two partial lists
     */
    second_end.next = null;
    
    /**
     * Two well-sorted lists into one well-sorted list
     */
    var sorted = merge(first, second_start);
    
    /**
     * No remaining elements: task is done
     */
    if ( !remaining )
        return sorted;
    
    /**
     * Appending sorted part to remaining list
     * Finding new last element for further executions
     */
    last.next = sorted;
    while ( last.next )
        last = last.next;
    
    /**
     * Call again until no unsorted elements can be found
     */
    return natural_merge_sort(remaining, last);
}

/**
 * Some random values
 */
var unsorted_array = create_random_array(AMOUNT, LIMIT);
/**
 * Conversion into a list is mandatory
 * Last element must be known
 * for recursive usage of 'natural_merge_sort()', so 'array_to_list()'
 * shall create the list and return the last element
 */
var originally_first = create_container(unsorted_array[0]);
var originally_last = array_to_list(originally_first, unsorted_array);

console.log( unsorted_array );

/**
 * The whole job
 */
var first_after_sort = natural_merge_sort(originally_first, originally_last);

/**
 * Conversion again for easy display
 */
var sorted_array = list_to_array(first_after_sort);
console.log( sorted_array );
