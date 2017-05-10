package com.poweronce.model;

import java.util.List;

public class PaginationSupport {

    public final static int PAGESIZE = 10;

    private int pageSize = PAGESIZE;

    private List items;

    private long totalCount;

    private long[] indexes = new long[0];

    private long startIndex = 0;

    public PaginationSupport(List items, long totalCount) {
	setPageSize(PAGESIZE);
	setTotalCount(totalCount);
	setItems(items);
	setStartIndex(0);
    }

    public PaginationSupport(List items, long totalCount, long startIndex) {
	setPageSize(PAGESIZE);
	setTotalCount(totalCount);
	setItems(items);
	setStartIndex(startIndex);
    }

    public PaginationSupport(List items, long totalCount, int pageSize, long startIndex) {
	setPageSize(pageSize);
	setTotalCount(totalCount);
	setItems(items);
	setStartIndex(startIndex);
    }

    public List getItems() {
	return items;
    }

    public void setItems(List items) {
	this.items = items;
    }

    public int getPageSize() {
	return pageSize;
    }

    public void setPageSize(int pageSize) {
	this.pageSize = pageSize;
    }

    public long getTotalCount() {
	return totalCount;
    }

    public void setTotalCount(long totalCount) {
	if (totalCount > 0) {
	    this.totalCount = totalCount;
	    long count = totalCount / pageSize;
	    if (totalCount % pageSize > 0)
		count++;
	    indexes = new long[(int) count];
	    for (int i = 0; i < count; i++) {
		indexes[i] = pageSize * i;
	    }
	} else {
	    this.totalCount = 0;
	}
    }

    public long[] getIndexes() {
	return indexes;
    }

    public void setIndexes(long[] indexes) {
	this.indexes = indexes;
    }

    public long getStartIndex() {
	return startIndex;
    }

    public void setStartIndex(long startIndex) {
	if (totalCount <= 0)
	    this.startIndex = 0;
	else if (startIndex >= totalCount)
	    this.startIndex = indexes[indexes.length - 1];
	else if (startIndex < 0)
	    this.startIndex = 0;
	else {
	    this.startIndex = indexes[(int) (startIndex / pageSize)];
	}
    }

    public long getNextIndex() {
	long nextIndex = getStartIndex() + pageSize;
	if (nextIndex >= totalCount)
	    return getStartIndex();
	else
	    return nextIndex;
    }

    public long getPreviousIndex() {
	long previousIndex = getStartIndex() - pageSize;
	if (previousIndex < 0)
	    return 0;
	else
	    return previousIndex;
    }

}
