package backend;

public class Member implements Comparable<Member> {
    public enum MemberType {
        BASIC, PREMIUM
    }

    private final String id;
    private final String name;
    private final MemberType type;
    private final int reservationPriority; // Higher numbers represent higher priority

    public Member(String id, String name, MemberType type, int reservationPriority) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.reservationPriority = reservationPriority;
    }

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public MemberType getType() {
        return type;
    }

    public int getReservationPriority() {
        return reservationPriority;
    }

    @Override
    public int compareTo(Member other) {
        // Higher priority value comes first in priority loops
        int priorityCompare = Integer.compare(other.reservationPriority, this.reservationPriority);
        if (priorityCompare != 0) {
            return priorityCompare;
        }
        // If priority is equal, fall back to alphabetical order of names
        return this.name.compareTo(other.name);
    }

    @Override
    public String toString() {
        return String.format("%s (%s, Priority: %d)", name, type, reservationPriority);
    }
}
